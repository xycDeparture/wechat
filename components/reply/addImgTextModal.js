import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Spin from 'antd/lib/spin'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'
import Emoji from 'Application/components/emoji'
import Popover from 'antd/lib/popover'
const FormItem = Form.Item




@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			img_url: '',
			uploading: false
		}
	}

	componentWillReceiveProps(nextProps) {
		// console.log(nextProps)
		if (nextProps.visible === false) {
			this.props.form.resetFields()
			this.setState({img_url: ''})
		}
		if (nextProps.visible) {
			if (Object.keys(nextProps.info).length > 0 &&!this.state.uploading) {
				this.setState({
					img_url: nextProps.info.content_txt_pictrue
				})
			} else if (!this.state.uploading) {
				console.info(this.state)
				this.setState({
					img_url: ''
				})
			}
		}
	}

	handleCancel() {
		this.state.uploading = false
		this.props.toggle(undefined, 'visible')
	}
    handleEmojiClick1(emoji) {
    	const form = this.props.form
    	form.setFieldsValue({
    		content_txt_title: (form.getFieldValue('content_txt_title') || '') + emoji
    	})
    }
    handleEmojiClick2(emoji) {
    	const form = this.props.form
    	form.setFieldsValue({
    		content_txt_description: (form.getFieldValue('content_txt_description') || '') + emoji
    	})
    }
	handleSubmit() {
		const info = this.props.info
		this.props.form.validateFields((err,values) => {
			if(err) {
				return false
			}
			values.content_txt_pictrue = this.state.img_url
			if (!values.content_txt_title) {
				message.error('请输入标题')
			} else if(!values.content_txt_url) {
				message.error('请输入链接地址')
			} else if(!values.content_txt_pictrue) {
				message.error('图片地址不能为空！')
			}else{
				Object.keys(info).length > 0? values.key = info.key: values.key = ''
				this.props.setDataSource(values)
				this.setState({
					img_url: ''
				})
				this.state.uploading = false
			}
		})
	}


	uploadFile(file) {
		this.state.uploading = true
		this.props.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				img_url:resolve.result.file_url
			})
		})
	}
	handleInput(event, name ) {
		console.log(event.target.value, name)
		this.setState({
			[name]: event.target.value
		})
	}
	renderForm() {
		const { getFieldDecorator } = this.props.form
		const info = this.props.info
		// console.log(Object.keys(info))
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const titleProps = getFieldDecorator('content_txt_title', {
			rules: [
				{ required: true, message: '请输入标题' }
			],
			initialValue: Object.keys(info).length > 0 ? this.props.info.content_txt_title+'': '',
		})(
			<Input type="text" />
		)

		const urlProps = getFieldDecorator('content_txt_url', {
			rules: [
				{ required: true, message: '请输入链接地址' }
			],
			initialValue: Object.keys(info).length > 0? this.props.info.content_txt_url+'': ''
		})(
			<Input type="text" />
		)

		const descriptionProps = getFieldDecorator('content_txt_description', {
			initialValue: Object.keys(info).length > 0? this.props.info.content_txt_description+'': ''
		})(
			<Input  type="textarea" rows="6" />
		)

		const fileProps = {
			accept:"image/png, image/jpeg, image/gif",
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this),
			fileList: this.state.img_url ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.img_url
			}] : [],
			onPreview: file =>{
				window.open(file.url)
			},
			onRemove: file =>{
				this.setState({
					img_url: ''
				})
			}
		}

		return(
			<Spin tip="正在上传图片..." spinning={this.props.fileLoading}>
				<Form layout='horizontal' >
			        <FormItem
			          {...formItemLayout}
			          label="标题："
			          required
			          hasFeedback
			          >
								{titleProps}
				        <Popover content={<Emoji onClick={::this.handleEmojiClick1}/>} placement="bottom" title="emoji图标" trigger="click">
	                        <a>emoji图标</a>
	                    </Popover>
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="链接地址："
			          required
			          hasFeedback
			          >
								{urlProps}
			        </FormItem>
			         <FormItem
			          {...formItemLayout}
			          label="描述："
			          disabled
			          hasFeedback
			          >
								{descriptionProps}
			          <Popover content={<Emoji onClick={::this.handleEmojiClick2}/>} placement="bottom" title="emoji图标" trigger="click">
                        <a>emoji图标</a>
                    </Popover>
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="上传封面："
			          hasFeedback
			          required
			          >
			         	<Upload {...fileProps}>
				         	<div style={{ width: '100%', height: '100%' }}>
								<Icon type="plus"/>
				         	</div>
						</Upload>
			        </FormItem>
				</Form>
			</Spin>
		)
	}

	render() {
		return(
			<Modal
				title="新增图文"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				onOk={::this.handleSubmit}
				maskClosable={false}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}
