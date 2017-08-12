import React, { PropTypes } from 'react'

import $ from 'jquery'

import ReactDOM from 'react-dom'
import Simditor from 'simditor/lib/simditor'

import Slider from 'antd/lib/slider'
import Modal from 'antd/lib/modal'
import styles from './edit.scss'
let content = ''

let caret = {}
export default class Editor extends React.Component {
	static propTypes = {
		//onChange: PropTypes.func.isRequired,
		// record: PropTypes.object.isRequired,
		record: PropTypes.string.isRequired,
		defaultValue: PropTypes.object.isRequired,
		uploadImg: PropTypes.func,
		addVideo: PropTypes.func,
		changeLastEditData: PropTypes.func
	}

	static getContent() {
		return content
	}

	state = {
		editor: null,
		inited: false
	}

	update(content, isImg) {
		// this.state.editor.setValue(content || '')
		if (isImg) {
			if (caret.anchorOffset == 0) {
				$(caret.anchorNode).before(content)
			} else {
				$(caret.anchorNode).after(content)
			}
			// if (caret.anchorOffset == 0) {
			//   $(caret.anchorNode).before(content)
			// } else if (caret.children) {
			//   $(caret.anchorNode).after(content)
			// } else {
			//   // 文本
			//   let innerHTML = caret.anchorNode.parentNode.innerHTML
			//   console.log(innerHTML.substring(0, caret.anchorOffset));
			//
			//   // 如果删除到同一行后依然会出现anchorOffset不准确的问题
			//   caret.anchorNode.parentNode.innerHTML = innerHTML.substring(0, caret.anchorOffset) + '</p>'
			//                                           + content
			//                                           + '<p>' + innerHTML.substring(caret.anchorOffset)
			// }
			//  设置Simditor的正文内容，自动格式化新内容,触发valuechanged
			this.state.editor.setValue(this.state.editor.body[0].innerHTML || content)

			return false
		}
		this.state.editor.setValue(content || '')
	}

	// shouldComponentUpdate(nextProps) {
	// 	return nextProps.content ? true : false
	// }

	resizeImg(img, perc) {
		const offsetWidth = img.dataset.offsetWidth
		img.style.width = offsetWidth * perc / 100 + 'px'
	}

	resizeImgCompleted() {
		this.update(this.state.editor.body[0].innerHTML)
	}

	componentWillReceiveProps(nextProps) {
		if (!this.state.inited) {
			this.update(nextProps.defaultValue.content)
			this.state.inited = true
		} else if (nextProps.record) {
			if (nextProps.record != this.props.record) {
				this.update(nextProps.record, true)
			}
		}
	}

	componentDidMount() {
		const textarea = ReactDOM.findDOMNode(this.refs.textarea)

		const editor = new Simditor({
			textarea: textarea,
			toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough',
				'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|',
				'link', /*'image',*/ 'hr', '|', 'indent', 'outdent', 'alignment'],
			allowedStyles: {
				img: ['width', 'height']
			}
		})

		const container = document.querySelector('.simditor-toolbar > ul')
		if (this.props.uploadImg) {
			const btn = this.createButton('图片')
			const uploadImg = ::this.props.uploadImg
			container.appendChild(btn)
			btn.querySelector('input').addEventListener('change', uploadImg)
		}
		// const videoBtn = this.createButton('视频')
		// container.appendChild(videoBtn)
		// videoBtn.addEventListener('click', ::this.handleVideoBtnClick)
		content = ''
		editor.on('valuechanged', function(e) {
			content = e.currentTarget.body[0].innerHTML
			this.props.changeLastEditData(content)
		}.bind(this))

        editor.on('blur', function(e) {
            content = e.currentTarget.body[0].innerHTML
            this.props.changeLastEditData(content)
        }.bind(this))

		editor.on('selectionchanged', function(e) {
			let selection = window.getSelection() || document.selection
			if (selection) {
				caret.anchorOffset = selection.anchorOffset // 位置
				caret.anchorNode = selection.anchorNode // 位置开始前的节点
				caret.children = selection.anchorNode.firstChild // 子元素
			}

		}.bind(this))

		editor.body.on('click', e => {
			if (e.target.tagName == 'IMG') {
				const target = e.target
				const width = target.offsetWidth
				target.removeAttribute('style')
				const realOffsetWidth = target.offsetWidth
				target.dataset.offsetWidth = realOffsetWidth
				target.style.width = width + 'px'
				target.style.height = 'auto'
				target.style.maxWidth = '100%'

				const defaultValue = width / realOffsetWidth * 100

				Modal.info({
					title: '修改图片大小',
					content: <Slider defaultValue={defaultValue} onChange={this.resizeImg.bind(this, target)} min={1} tipFormatter={v => v + '%'}/>,
					okText: '修改好了',
					onOk: ::this.resizeImgCompleted
				})
			}
		})


		this.setState({ editor }, () => {
			this.update(this.props.record.content)
		})
	}

	createButton(name) {
		const li = document.createElement('li')
		let style = {
			width: '46px',
			textAlign: 'center',
			fontSize: '12px',
			color: '#666',
			verticalAlign: 'sub',
			cursor: 'pointer',
			position: 'relative'
		}
		for (let i in style) {
			li.style[i] = style[i]
		}

		const form = document.createElement('form')
		const inputId = Math.random().toString(36).substr(2, 7)
		const input = document.createElement('input')
		input.type = 'file'
		input.id = inputId
		style = {
			position: 'fixed',
			clip: 'rect(0 0 0 0)',
			zIndex: 11111,
			width: '100%'
		}
		for (let i in style) {
			input.style[i] = style[i]
		}
		form.appendChild(input)

		const label = document.createElement('label')
		label.setAttribute('for', inputId)
		label.innerHTML = name
		label.style.cursor = 'pointer'
		li.appendChild(form)
		li.appendChild(label)

		return li
	}
	// 视频按钮
	creatVideoBtn(name) {
		const li = document.createElement('li')
		const style = {
			width: '46px',
			textAlign: 'center',
			fontSize: '12px',
			color: '#666',
			verticalAlign: 'sub',
			cursor: 'pointer',
			position: 'relative'
		}
		for (let i in style) {
			li.style[i] = style[i]
		}
		const label = document.createElement('label')
		label.innerHTML = name
		label.style.cursor = 'pointer'
		li.appendChild(label)
		return li
	}
	handleVideoModalOnOk(e) {
		this.props.addVideo(this.state.video_address)
	}
	handleVideoModalOnCancel(e) {

	}
	handleVideoBtnClick(e) {
		e.preventDefault()
		Modal.confirm({
			title: '插入视频',
			content: <input type="text" value={this.state.video_address} className={styles.modal_input} placeholder="请入视频地址" onChange={::this.handleInputChange} />,
			okText: '确定',
			onOk: ::this.handleVideoModalOnOk,
          	cancelText: "取消",
			onCancel: ::this.handleVideoModalOnCancel
		})
	}
	handleInputChange(e) {
		const value = e.target.value
		this.setState({
			video_address: value
		})
	}
	render() {
		// TODO 判断浏览器的高度 然后设置rows
		return (
			<div className="edit-warp">
				<textarea ref='textarea' defaultValue={this.props.defaultValue.content} rows="20"/>
			</div>
		)
	}
}
