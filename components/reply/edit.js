import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Table from 'antd/lib/table'
import Popconfirm from 'antd/lib/popconfirm'
import Col from 'antd/lib/col'

import Icon from 'antd/lib/icon'

import message from 'antd/lib/message'
import Spin from 'antd/lib/spin'
import AddModal from './addImgTextModal'
import Auth from 'Application/components/auth'
import safeString from 'safeString'
import Emoji from 'Application/components/emoji'
import Popover from 'antd/lib/popover'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option


@Form.create()
export default class Edit extends React.Component{
	constructor(props, context) {
		super(props, context)
		this.state = {
			ready: false,
			visible: false,
			content: '',
			dataSource: [],
			event_type: '',
			reply_type: '',
			sign_type: '',
			img_url:'',
			info:{}
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		const dataSource = nextProps.info.toJS().content

		if(Object.prototype.toString.call(dataSource) == '[object Array]'){
			dataSource.forEach((item, index) => {
				item.key = index
			})
		}
		if(!this.state.ready) {
			this.setState({
				event_type: nextProps.info.toJS().type,
				reply_type: nextProps.info.toJS().reply_type,
				sign_type: nextProps.info.toJS().sign,
				dataSource: Object.prototype.toString.call(dataSource) == '[object Array]'?dataSource: [],
				content: Object.prototype.toString.call(dataSource) == '[object Array]'?'': dataSource,
				ready: true
			})
		}
	}

	onChangeReplyType(value) {
		this.setState({
			reply_type: value,
			content: ''
		})
		this.props.form.setFieldsValue({content_text: ''})
	}

	onChangeEventType(value) {
		this.setState({
			event_type: value
		})
	}

	onChangeSignType(event) {
		this.setState({
			sign_type: event.target.value
		})
	}

	onImgChange(value) {
		this.setState({
			content: value
		})
	}

	handleTextChange(event) {
		this.setState({
			content: event.target.value
		})
	}

	onChangeGroup(value) {
		const { setFieldsValue } = this.props.form
		const obj = value.find(item => item == -1)
		if(obj == -1) {
			setTimeout(() => {
				setFieldsValue({'wechat_group': ["-1"]})
			}, 100)
		}
	}

	setDataSource(info) {
		const dataSource = this.state.dataSource
		const dataEdit = this.state.info
		if(Object.keys(dataEdit).length > 0) {
			const index = dataSource.findIndex(item => item.key == info.key)
			if(index > -1) dataSource[index] = info
		}else{
			info.key = info.content_txt_pictrue
			dataSource.push(info)
		}
		this.setState({
			info: info,
			dataSource: dataSource,
			visible: false
		})
	}

	removeItem(title, dataSource) {
		dataSource = dataSource.filter(item => {
			return item.content_txt_title != title
		})
		this.setState({
			dataSource: dataSource
		})
	}

	changeSort(obj, type) {
		const dataSource = this.state.dataSource
		const index = dataSource.findIndex(item => item.key == obj.key)
		if(index > -1) {
			var z = ''
			if(type == 'up' && index != 0) {
				z = dataSource[index]
				dataSource[index] = dataSource[index - 1]
				dataSource[index - 1] = z
			}
			if(type == 'down' && index != dataSource.length - 1) {
				z = dataSource[index]
				dataSource[index] = dataSource[index + 1]
				dataSource[index + 1] = z
			}
			this.setState({dataSource: dataSource})
		}
		else return
	}

	handleEdit(info) {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const dataSource = this.state.dataSource
			if(this.state.reply_type == 3) {
				const content_txt_title = []
				const content_txt_description = []
				const content_txt_pictrue =[]
				const content_txt_url = []
				dataSource.forEach(item => {
					content_txt_title.push(item.content_txt_title)
					content_txt_description.push(item.content_txt_description)
					content_txt_pictrue.push(item.content_txt_pictrue)
					content_txt_url.push(item.content_txt_url)
				})
				values.content_txt_title = content_txt_title
				values.content_txt_description = content_txt_description
				values.content_txt_pictrue = content_txt_pictrue
				values.content_txt_url = content_txt_url
			}

			values.reply_type = this.state.reply_type
			values.type = this.state.event_type
			values.sign = this.state.sign_type
			values.wechat_group = values.wechat_group.find(item => item == -1)? '-1': values.wechat_group.join()
			// if (values.reply_type == 1) values.content_text = this.state.content
			// if (values.reply_type == 2) values.content_pictrue = this.state.content
			const id = this.context.location.query.id
			this.props.actions.updateReplyList(values, id).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push('wechat/reply/list')
			})
		})

	}


	toggleModal(info, visible, cb) {
		if(info) {
			if(cb) {
				cb(info)
			}
			this.setState({
				[visible]: !this.state[visible],
				info: info,
				ready: true
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
				ready: true,
				info: {}
			})
		}
	}
	handleEmojiClick(emoji) {
		const form = this.props.form
		form.setFieldsValue({
			content_text: form.getFieldValue('content_text') + emoji
		})
    }

	renderForm() {
		const { getFieldDecorator } = this.props.form
		const editSelect = this.props.editSelect.toJS()
		const info = this.props.info.toJS()
		const toggleModal = (obj, visible, fn) => _ => {
			return this.toggleModal(obj, visible, fn)
		}
		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 12 }
		}

		const keywordProps = getFieldDecorator('keyword', {
			initialValue: info.keyword
		})(
			<Input type="text" />
		)

		const signProps = getFieldDecorator('sign', {
			rules: [
				{ required: true,  message: '请选择' }
			],
			initialValue: safeString(info.sign)
		})(
			<RadioGroup onChange={::this.onChangeSignType}>
						{
					editSelect.signType.map(item => {
						return (
							<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
						)
					})
				}
			</RadioGroup>
		)

		const typeProps = getFieldDecorator('type', {
			rules: [
				{ required: true,  message: '请选择' }
			],
			initialValue: safeString(info.type),
			onChange: ::this.onChangeEventType
		})(
			<Select size="large" placeholder="请选择类型：" >
				{
					editSelect.evenType.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const replyTypeProps = getFieldDecorator('reply_type', {
			rules: [
				{ required: true,  message: '请选择' }
			],
			initialValue: safeString(info.reply_type),
			onChange: ::this.onChangeReplyType
		})(
			<Select size="large" placeholder="请选择类型：">
				{
					editSelect.replyType && editSelect.replyType.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const sceneProps = getFieldDecorator('scene', {
			initialValue: safeString(info.scene)
		})(
			<Select size="large"  placeholder="请选择类型：" >
				{
					editSelect.sceneList.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const contentProps = getFieldDecorator('content_text', {
			rules: [
                { required: this.state.reply_type == 1,  message: '请输入文本内容' }
            ],
            initialValue: this.state.reply_type == 1 ? safeString(info.content) : null
		})(
			<Input type="textarea" rows="6"/>
		)

    const mstchingProps = getFieldDecorator('mstching_type', {
        initialValue: safeString(info.mstching_type)
    })(
			<RadioGroup>
				{
					editSelect.mstchingType && editSelect.mstchingType.map(item => {
						return (
							<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
						)
					})
				}
			</RadioGroup>
		)

		const imgProps = getFieldDecorator('content_pictrue', {
			initialValue: info.reply_type == 2 ? safeString(info.content) : null
		})(
			<Select
			showSearch
			optionFilterProp="children"
			notFoundContent="无法找到"
			size="large"
			onChange={::this.onImgChange}
			placeholder="请选择素材："
			>
				{
					editSelect.allImage && editSelect.allImage.map(item => {
						return (
							<Option key={item.media_id} value={item.media_id}>{item.name}</Option>
						)
					})
				}
			</Select>
		)
		const weixinGroup = [ {id: '-1', name: '全部' }].concat(editSelect.weixinGroup)
		const groupProps = getFieldDecorator('wechat_group',{
			onChange: ::this.onChangeGroup,
			initialValue: safeString(info.wechat_group)
		})(
			<Select mode="multiple" size="large" placeholder="请选择分组">
				{
				    weixinGroup.map(item =>
			            <Option key={item.id} value={item.id+''}>{item.name}</Option>
			        )
				}
			</Select>
		)
		const signNameProps = getFieldDecorator('sid', {
			initialValue: safeString(info.sid)
		})(
			<Select size="large"  placeholder="请选择签到名称：">
				{
					editSelect.signName.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const setImgUrl = (img_url) => {
			this.setState({
		      	content: img_url
		      })
		}

		const offset = (replyType) => {
			switch(replyType) {
				case 1:
				return '6'
				case 2:
				return '6'
				case 3:
				return '20'
			}
		}

		const fileProps = {
		  	name: 'file',
		  	action: `${this.props.assetsUrl}/upload/upload`,
		  onChange(info) {
		    if (info.file.status !== 'uploading') {

		    }
		    if (info.file.status === 'done') {
		    	const img_url = info.file.response.file_url
		      message.success(`${info.file.name} 上传成功。`)
		      setImgUrl(img_url)

		    } else if (info.file.status === 'error') {
		      message.error(`${info.file.name} 上传失败。`)
		    }
		  }
		}

		return(
			<Form layout='horizontal' style={{marginTop: 30}} >

			        <FormItem  {...formItemLayout}  label="事件类型：">
									{typeProps}
		        	</FormItem>
		        	<div hidden={this.state.event_type != 2}>
		        		 <FormItem
				          {...formItemLayout}
				          label="关键字："
				          disabled
				          hasFeedback
				          >
									{keywordProps}
			        	</FormItem>
		        	</div>
		        	<div hidden={this.state.event_type != 4}>
		        		<FormItem  {...formItemLayout} label="场景回复：">
										{sceneProps}
		        		</FormItem>
		        	</div>
		        	<div hidden={this.state.event_type == 4 || this.state.event_type == 1}>
			        	<FormItem   {...formItemLayout} label="微信分组：">
										{groupProps}
			        	</FormItem>
		        	</div>

                    <FormItem
                      {...formItemLayout}
                      label="匹配类型："
                      hasFeedback
                      >
											{mstchingProps}
                    </FormItem>

		        	<FormItem
			          {...formItemLayout}
			          label="签到："
			          hasFeedback
			          >
								{signProps}
			        </FormItem>
			        <div hidden={this.state.sign_type != 1}>
		        		<FormItem  {...formItemLayout} label="签到名称：">
										{signNameProps}
		        		</FormItem>
		        	</div>
		        	<FormItem  {...formItemLayout} label="回复类型：">
									{replyTypeProps}
		        	</FormItem>
		        	<div hidden={this.state.reply_type == 1 ? false : true}>
			        	<FormItem
				          {...formItemLayout}
				          label="文本内容："
				          hasFeedback
				          >
									{contentProps}
					        <Popover content={<Emoji onClick={::this.handleEmojiClick} />} placement="bottom" title="emoji图标" trigger="click">
		                        <a>emoji图标</a>
		                    </Popover>
				        </FormItem>
			 		</div>
			 		<div hidden={this.state.reply_type == 2 ? false : true}>
			        	<FormItem  {...formItemLayout} label="选择图片素材：">
										{imgProps}
		        		</FormItem>
			 		</div>
			 		<div hidden={this.state.reply_type == 3 ? false : true}>
			        	<FormItem
				          {...formItemLayout}
				          label="图文内容："
				          hasFeedback
				          >
				          <Button  type="primary" onClick={toggleModal(undefined, 'visible')}>
				          	<Icon type="plus" />添加图文
				          </Button>
				        </FormItem>
			 		</div>
			 		<div>
			 			{this.renderTable()}
			 		</div>
			         <FormItem {...formItemLayout} style={{marginTop: 20}}>
		         		<Auth
		         			type={["wechat-reply-update"]}
		         			dpid={this.props.info.get('dpid')}
		         			nid={this.props.info.get('nid')}
		         			cpid={this.props.info.get('cpid')}
		         			uid={this.props.info.get('create_user')}
		         		>
				        	<Col offset={4}>
				        		<Button type="ghost" style={{width: 100, marginLeft: 40}} onClick={() => { history.back() }}>返回</Button>
		        	        	<Button type="primary" style={{width: 100, marginLeft: 20}} onClick={::this.handleEdit} >提交</Button>
		        			</Col>
		        		</Auth>
				     </FormItem>
				</Form>
		)
	}

	renderTable() {
		var  dataSource = this.state.dataSource
		const assetsUrl = this.props.assetsUrl
		const removeItem = (title, dataSource) => _ => {
			return this.removeItem(title, dataSource)
		}
		const toggleModal = (info, visible, cb) => _ => {
			return this.toggleModal(info, visible, cb)
		}
		const changeSort = (obj, type) => _ => {
			return this.changeSort(obj, type)
		}
		const columns = [{
			title: '标题',
			dataIndex: 'content_txt_title',
			key: 'content_txt_title'
		}, {
			title: '图片地址',
			dataIndex: 'content_txt_pictrue',
			key: 'content_txt_pictrue',
			render(img) {
                img = img.match(/(http|https):\/\//g) ? img : assetsUrl + img
				return(
					<div><img className='head-img' src={img}/></div>
				)
			}
		}, {
			title: '链接地址',
			dataIndex: 'content_txt_url',
			key: 'content_txt_url',
		}, {
			title: '排序',
			key: 'sort',
			render(status, obj) {
				return(
					<div>
						<div><a><Icon onClick={changeSort(obj, 'up')} type="caret-up"/></a></div>
						<div><a><Icon onClick={changeSort(obj, 'down')} type="caret-down"/></a></div>
					</div>
				)
			}
		}, {
			title: '描述',
			dataIndex: 'content_txt_description',
			key: 'content_txt_description',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<a onClick={toggleModal(obj, 'visible')}>修改</a>
						<span style={{marginLeft: 5}}></span>
						<Popconfirm title="确定要删除吗？" onConfirm={removeItem(obj.content_txt_title, dataSource)}>
							<a>删除</a>
						</Popconfirm>
					</div>
				)
			}
		}]

		return (
			<div hidden={this.state.reply_type != 3} >
				<Table
					columns={columns}
					dataSource={this.state.dataSource}
					pagination={false}
				/>
			</div>
		)
	}
	render() {
		return (
			<div>
				<Spin spinning={!this.state.ready}>
					{this.renderForm()}
				</Spin>
				<AddModal
					visible={this.state.visible}
				    toggle={::this.toggleModal}
				    setDataSource={::this.setDataSource}
				    uploadFile={this.props.actions.uploadFile}
				    fileLoading={this.props.fileLoading}
				    assetsUrl={this.props.assetsUrl}
				    info={this.state.info}
				/>
			</div>
		)
	}
}
