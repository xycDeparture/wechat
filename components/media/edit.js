import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'


import Select from 'antd/lib/select'
const Option = Select.Option
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'
import Spin from 'antd/lib/spin'

import Auth from 'Application/components/auth'
import safeString from 'safeString'

const FormItem = Form.Item

@Form.create()
export default class MediaEditCom extends React.Component {

	static propTypes = {
		editData: PropTypes.instanceOf(Immutable.Map).isRequired,
		validateType: PropTypes.instanceOf(Immutable.List).isRequired,
		mediaType: PropTypes.instanceOf(Immutable.List).isRequired,


		actions: PropTypes.object.isRequired,
		assetsUrl: PropTypes.string.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		mediaType: undefined,
		upload: {
			img: '',
			audio: '',
			video: '',
			thumbImg: ''
		}
	}

	changeMediaType(mediaType) {
		this.setState({
			mediaType
		})
	}

	uploadFile(type, file) {
		this.props.actions.uploadFile(file).then(x => {
			message.success(x.errormsg)
			this.setState({
				upload: {
					...this.state.upload,
					[type]: this.props.assetsUrl + x.result.file_url
				}
			})
		})
	}

	handleFileRemove(type) {
		this.setState({
			upload: {
				...this.state.upload,
				[type]: ''
			}
		})
	}

	handleSubmit() {
		this.props.form.validateFields((errors, values) => {
			if (errors) {
				return
			}

			const act = this.props.editData.size ? 'update' : 'add'
			const id = this.props.editData.get('id')

			const mediaType = ['', 'img', 'audio', 'video', 'thumbImg'][values.media_type]
			let uploadUrl = this.state.upload[mediaType]
			if (act === 'add' && !uploadUrl) {
				return message.error('请选择文件', 3)
			}
			uploadUrl = uploadUrl.replace(new RegExp(this.props.assetsUrl), '')

			const uploadField = {
				img: 'pic',
				audio: 'voi',
				video: 'vid',
				thumbImg: 'pic'
			}[mediaType]


			let postData
			if (act === 'update') {
				postData = {
					name: values.name
				}
			} else {
				postData = {
					...values,
					[uploadField]: uploadUrl
				}
			}

			this.props.actions.saveWechatMedia({ postData, act, id }).then(x => {
				message.success(x.errormsg)
				this.context.router.replace('/wechat/media-material/list')
			})

		})
	}

	renderForm() {
		const formItemLayout = {
		    labelCol: { span: 4 },
		    wrapperCol: { span: 16 }
		}

		const {
			validateType,
			mediaType,
			editData,
			form: {
				getFieldDecorator
			}
		} = this.props

		const nameProps = getFieldDecorator('name', {
			rules: [
		       { required: true, message: '请输入名称' }
			],
			initialValue: editData.get('name')
		})(
			<Input type="text" />
		)

		const typeProps = getFieldDecorator('type', {
			rules: [
		       { required: true, message: '请选择有效期类型' }
			],
			initialValue: safeString(editData.get('type'))
		})(
			<Select disabled={!!editData.size} placeholder="请选择类型" style={{ width: 150 }}>
					{
						validateType.map(item =>
							<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
						)
					}
				</Select>
		)

		const mediaTypeProps = getFieldDecorator('media_type', {
			rules: [
		       { required: true, message: '请选择素材类型' }
			],
			initialValue: safeString(editData.get('media_type')),
			onChange: ::this.changeMediaType
		})(
			<Select disabled={!!editData.size} placeholder="请选择类型" style={{ width: 150 }}>
				{
					mediaType.map(item =>
						<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
					)
				}
			</Select>
		)

		const videoTitleProps = getFieldDecorator('title', {
			initialValue: editData.get('title')
		})(
			<Input type="text"/>
		)

		const videoDescProps = getFieldDecorator('introduction', {
			initialValue: editData.get('introduction')
		})(
			<Input type="textarea"/>
		)


		const getFile = function(type) {
			if (this.state.upload[type]) {
				return [{
					url: this.state.upload[type],
					status: 'done',
					uid: -1
				}]
			} else if (this.props.editData.get('upload_url')) {
				return [{
					url: this.props.assetsUrl + this.props.editData.get('upload_url'),
					status: 'done',
					uid: -1
				}]
			}

			return []
		}.bind(this)


		const uploadImgProps = {
			listType: 'picture',
			beforeUpload: this.uploadFile.bind(this, 'img'),
			fileList: getFile('img'),
			accept: 'image/png,image/jpeg,image/gif',
			onRemove: this.handleFileRemove.bind(this, 'img')
		}

		const uploadAudioProps = {
			beforeUpload: this.uploadFile.bind(this, 'audio'),
			fileList: getFile('audio'),
			accept: 'audio/*',
			onRemove: this.handleFileRemove.bind(this, 'audio')
		}

		const uploadVideoProps = {
			beforeUpload: this.uploadFile.bind(this, 'video'),
			fileList: getFile('video'),
			accept: 'video/*',
			onRemove: this.handleFileRemove.bind(this, 'video')
		}

		const uploadThumbImgProps = {
			listType: 'picture',
			beforeUpload: this.uploadFile.bind(this, 'thumbImg'),
			fileList: getFile('thumbImg'),
			accept: 'image/png,image/jpeg,image/gif',
			onRemove: this.handleFileRemove.bind(this, 'thumbImg')
		}

		const btnText = editData.size ? '更新' : '新增'
		return(
			<Form layout='horizontal' >
				<FormItem
		          {...formItemLayout}
		          label="名称："
		          hasFeedback
		          >
							{nameProps}
		        </FormItem>
		        <FormItem  {...formItemLayout} label="有效期类型：">
							{typeProps}
	        	</FormItem>
	        	<FormItem  {...formItemLayout} label="素材类型：">
								{mediaTypeProps}
	        	</FormItem>
	        	<FormItem  {...formItemLayout} label="上传说明：">
    	        	<p><font color="#57c5f7">图片：(image)：2M，支持bmp/png/jpeg/jpg/gif格式</font></p>
    	        	<p><font color="#57c5f7">语音（voice）：2M，播放长度不超过60s，支持AMR\MP3格式</font></p>
    	        	<p><font color="#57c5f7">视频（video）：10MB，支持MP4格式</font></p>
    	        	<p><font color="#57c5f7">缩略图（thumb）：64KB，支持JPG格式</font></p>
	        	</FormItem>

        		{{
        			'1': (
        				<FormItem {...formItemLayout} label="上传图片：">
	        				<Upload {...uploadImgProps}>
								<Button type="ghost" disabled={!!editData.size}>
									<Icon type="upload" /> 点击上传
								</Button>
							</Upload>
						</FormItem>
        			),
        			'2': (
        				<FormItem {...formItemLayout} label="上传语音：">
	        				<Upload {...uploadAudioProps}>
								<Button type="ghost" disabled={!!editData.size}>
									<Icon type="upload" /> 点击上传
								</Button>
							</Upload>
						</FormItem>
        			),
        			'3': ([
        				<FormItem key={1} {...formItemLayout} label="上传视频：">
	        				<Upload {...uploadVideoProps}>
								<Button type="ghost" disabled={!!editData.size}>
									<Icon type="upload" /> 点击上传
								</Button>
							</Upload>
						</FormItem>,
						<FormItem key={2} {...formItemLayout} label="视频标题：">
								{videoTitleProps}
						</FormItem>,
						<FormItem key={3} {...formItemLayout} label="视频描述：">
								{videoDescProps}
						</FormItem>
        			]),
        			'4': (
        				<FormItem {...formItemLayout} label="上传图片：">
	        				<Upload {...uploadThumbImgProps}>
								<Button type="ghost" disabled={!!editData.size}>
									<Icon type="upload" /> 点击上传
								</Button>
							</Upload>
						</FormItem>
        			)
        		}[this.state.mediaType || editData.get('media_type')]}


		        <Auth
		        	type={["wechat-media-material-update"]}
		        	dpid={editData.get('dpid')}
					nid={editData.get('nid')}
					cpid={editData.get('cpid')}
					uid={editData.get('create_user')}
		        >
		        	<FormItem  {...formItemLayout}>
			        	<Col offset="6">
			        		<Button size="large" onClick={() => history.back()} style={{ marginRight: 16 }} >返回</Button>
	        	        	<Button type="primary" size="large" onClick={::this.handleSubmit}>{btnText}</Button>
	        			</Col>
			        </FormItem>
		        </Auth>

			</Form>
		)
	}

	render() {
		return (
			<Spin spinning={this.props.loading}>
				<div className="pure-form">
					{this.renderForm()}
				</div>
			</Spin>

		)
	}
}
