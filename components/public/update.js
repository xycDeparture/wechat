import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import Spin from 'antd/lib/spin'
import message from 'antd/lib/message'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
/**
 * 微信－公众号－编辑
 */
@Form.create()
export default class EditComp extends React.Component {
	constructor(props, context) {
    	super(props, context)
    	this.state={
    		ready: false,
    		check_pay: '',
    		photo_wall:'',
    		customer_service: '',
    		img_url: '',
    		info: {}    	}
  	}

  	static propTypes = {
  		select: PropTypes.instanceOf(Immutable.Map).isRequired,
  		info: PropTypes.instanceOf(Immutable.Map).isRequired
  	}

  	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		const info = nextProps.info.toJS()
		const id = this.context.location.query.id
		if(!this.state.ready && info.id == id) {
			this.setState({
				img_url: info.head_img,
				check_pay: info.pay_mode,
				photo_wall: info.photo_wall,
				customer_service: info.customer_service,
				ready: true
			})
		}
	}

  	handleSubmit(e) {
  		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	values.id = this.context.location.query.id
	  		values.head_img = this.state.img_url
	      	values.pay_mode = this.state.check_pay
	      	values.customer_service = this.state.customer_service
	      	values.photo_wall = this.state.photo_wall
	      	this.props.actions.updatePublicList(values, values.id).then(reslove => {
	      		message.success(reslove.errormsg)
	      		this.context.router.push('/wechat/public/list')
	      		this.props.form.resetFields()
	      	})
    	})
  	}

  	onChangePay(e) {
  		e.preventDefault()
  		const value = e.target.value
  		this.setState({
  			check_pay: value
  		})
  	}

  	onChangePhoto(e) {
  		e.preventDefault()
  		const value = e.target.value
  		this.setState({
  			photo_wall: value
  		})
  	}

  	onChangeService(e) {
  		e.preventDefault()
  		const value = e.target.value
  		this.setState({
  			customer_service: value
  		})
  	}

  	handleReset(e) {
  	    e.preventDefault();
  	    this.props.form.resetFields()
  	}

  	uploadFile(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				img_url:resolve.result.file_url
			})
		})
	}

	handleFileRemove() {
		this.setState({
			img_url: ''
		})
	}

	render() {
		const select = this.props.select.toJS()
		const info = this.props.info.toJS()
		const { getFieldDecorator } = this.props.form
		/*验证开始*/
		const publicNumberProps = getFieldDecorator('nick_name', {
			rules: [
		       { required: true, message: '请输入公众号昵称' },
			],
			initialValue: info.nick_name
		})(
			<Input id="pbNumber" size="large" type="text" />
		)

		const originIdProps = getFieldDecorator('original_id', {
			rules: [
		       { required: true, message: '请输入oId' },
			],
			initialValue: info.original_id
		})(
			<Input size="large" type="text" readOnly/>
		)

		const appIdProps = getFieldDecorator('appId', {
			rules: [
		       { required: true, message: '请输入appId' },
			],
			initialValue: info.appId
		})(
			<Input size="large" type="text" />
		)

		const secretProps = getFieldDecorator('appSecret', {
			rules: [
				{ required: true, message: '请输入appSecret' },
			],
			initialValue: info.appSecret
		})(
			<Input size="large" type="text" />
		)

		const tokenProps = getFieldDecorator('token', {
			initialValue: info.token
		})(
			<Input size="large" type="text" readOnly/>
		)

		const apiProps = getFieldDecorator('api_key', {
			initialValue: info.api_key
		})(
			<Input size="large" type="text" readOnly/>
		)

		const wechatProps = getFieldDecorator('wechat_account', {
			rules: [
			   { required: true, message: '请输入微信号' },
			],
			initialValue: info.wechat_account
		})(
			<Input size="large" type="text" readOnly/>
		)

		const shNumberProps = getFieldDecorator('mch_id', {
			initialValue: info.mch_id
		})(
			<Input size="large" type="text" />
		)

		const zzKeyProps = getFieldDecorator('pay_key', {
			initialValue: info.pay_key
		})(
			<Input size="large" type="text" />
		)

		const select1Props = getFieldDecorator('auth_status', {
			rules: [
				        { required: true,  message: '请选择授权状态' }
				],
		     initialValue: info.auth_status + ''
		})(
			<Select size="large" placeholder="请选择授权状态" style={{ width: 150 }}>
				{
					select.authState.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const select2Props = getFieldDecorator('service_type_info', {
			rules: [
				        { required: true,  message: '请选择公众号类型' }
				],
		     initialValue: info.service_type_info + ''
		})(
			<Select size="large" placeholder="请选择公众号类型" style={{ width: 150 }}>
				{
					select.serviceType.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const select3Props = getFieldDecorator('verify_type_info', {
			rules: [
				        { required: true,  message: '请选择认证类型' }
				],
		    initialValue: info.verify_type_info + ''
		})(
			<Select size="large" placeholder="请选择认证类型" style={{ width: 150 }}>
				{
					select.verifyType.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const radio1Props = getFieldDecorator('pay_mode', {
			rules: [
				        { required: true,  message: '请选择支付模式' }
			],
			initialValue: info.pay_mode+''
		})(
			<RadioGroup onChange={::this.onChangePay} >
				{
					select.payModel.map(item => {
						return (
							 <Radio key={item.id} value={item.id+''}>{item.name}</Radio>
						)
					})
				}
			</RadioGroup>
		)

		const radio2Props = getFieldDecorator('photo_wall', {
			rules: [
				        { required: true,  message: '请选择是否开启照片墙' }
			],
			initialValue: info.photo_wall+''
		})(
			<RadioGroup onChange={::this.onChangePhoto}>
				{
					select.photoWall.map(item => {
						return (
							 <Radio key={item.id} value={item.id+''}>{item.name}</Radio>
						)
					})
				}
			</RadioGroup>
		)

		const radio3Props = getFieldDecorator('photo_print', {
			rules: [
				        { required: true, message: '请选择是否开启照片打印' }
				],
			initialValue: info.photo_print+''
		})(
			<RadioGroup>
				{
					select.photoPrintType.map(item => {
						return (
							 <Radio key={item.id} value={item.id+''}>{item.name}</Radio>
						)
					})
				}
			</RadioGroup>
		)

		const radio4Props = getFieldDecorator('customer_service', {
			rules: [
				        { required: true,  message: '请选择是否开启客服服务' }
				],
			initialValue: info.customer_service+''
		})(
			<RadioGroup onChange={::this.onChangeService}>
				{
					select.customerService.map(item => {
						return (
							 <Radio key={item.id} value={item.id+''}>{item.name}</Radio>
						)
					})
				}
			</RadioGroup>
		)

		const photoKeywordProps = getFieldDecorator('photo_wall_keyword', {
			initialValue: info.photo_wall_keyword
		})(
			<Input  size="large" type="text" />
		)

		const photoWallCheckProps = getFieldDecorator('photo_wall_check', {
			initialValue: info.photo_wall_check + ''
		})(
			<RadioGroup>
				<Radio key={0} value="0">不开启</Radio>
				<Radio key={1} value="1">开启</Radio>
			</RadioGroup>
		)

    const photoSceneListProps = getFieldDecorator('photo_wall_scene', {
        initialValue: info.photo_wall_scene
    })(
			<Select size="large" placeholder="请选择微信墙场景" style={{ width: 150 }}>
					{
							select.photoSceneList.map(item => {
									return (
											<Option key={item.id} value={item.id+''}>{item.activity_name}</Option>
									)
							})
					}
			</Select>
		)

		const photoExpiresProps = getFieldDecorator('photo_wall_keyword_expires', {
			initialValue: info.photo_wall_keyword_expires
		})(
			<Input  size="large" type="text" />
		)

		const photoRimgProps = getFieldDecorator('photo_wall_image_rmsg', {
			initialValue: info.photo_wall_image_rmsg
		})(
			<Input size="large" type="text" />
		)

		const photoRtextProps = getFieldDecorator('photo_wall_text_rmsg', {
			initialValue: info.photo_wall_text_rmsg
		})(
			<Input size="large" type="text" />
		)

		const serviceKeywordProps = getFieldDecorator('customer_service_keyword', {
			initialValue: info.customer_service_keyword
		})(
			<Input size="large" type="text" />
		)

		const servicePromptProps = getFieldDecorator('customer_service_prompt_message', {
			initialValue: info.customer_service_prompt_message
		})(
			<Input size="large" type="text" />
		)

		/*验证结束*/

		const formItemLayout = {
		    labelCol: { span: 4 },
		    wrapperCol: { span: 12 }
		}

		const fileProps = {
			accept: 'image/png,image/jpeg,image/gif',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this),
			fileList: this.state.img_url ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.img_url
			}] : [],
			onRemove: this.handleFileRemove.bind(this)
		}


		return (
			<Spin tip="正在上传图片..." spinning={this.props.fileLoading}>
				<Form layout='horizontal'  style={{ marginTop: 40 }}>
					<FormItem
			          {...formItemLayout}
			          label="公众号："
			          hasFeedback
			          >
								{publicNumberProps}
			       </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="原始id："
			          hasFeedback
			          >
								{originIdProps}
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="Appid："
			          hasFeedback
			          >
								{appIdProps}
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="Appsecret："
			          hasFeedback
			          >
								{secretProps}
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="token："
			          hasFeedback
			          >
								{tokenProps}
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="接口地址："
			          hasFeedback
			          >
								{apiProps}
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="微信号："
			          hasFeedback
			          >
								{wechatProps}
			        </FormItem>

			        <FormItem  {...formItemLayout} label="授权状态：" hasFeedback>
									{select1Props}
			        </FormItem>

			        <FormItem  {...formItemLayout} label="公众号类型：" hasFeedback>
									{select2Props}
			        </FormItem>

			        <FormItem  {...formItemLayout} label="认证类型：" hasFeedback>
									{select3Props}
			        </FormItem>

			         <FormItem  {...formItemLayout} label="支付模式：" hasFeedback>
							 		{radio1Props}
			        </FormItem>
		        	<div  hidden={this.state.check_pay == 1? false: true}>
				        <FormItem
				          {...formItemLayout}
				          label="商户号："
				          hasFeedback
				          >
									{shNumberProps}
				        </FormItem>

				        <FormItem
				          {...formItemLayout}
				          label="最终秘钥："
				          hasFeedback
				          >
									{zzKeyProps}
				        </FormItem>
		        	</div>
			        <FormItem  {...formItemLayout} label="照片墙：" hasFeedback>
									{radio2Props}
			        </FormItem>
			        <div  hidden={this.state.photo_wall == 1? false: true}>
				        <FormItem
				          {...formItemLayout}
				          label="照片墙关键字："
				          hasFeedback
				          >
									{photoKeywordProps}
				        </FormItem>

				        <FormItem  {...formItemLayout} label="照片墙照片审核：" hasFeedback>
										{photoWallCheckProps}
			        	</FormItem>

                        <FormItem  {...formItemLayout} label="微信墙场景：" hasFeedback>
														{photoSceneListProps}
                        </FormItem>

			        	<FormItem
				          {...formItemLayout}
				          label="照片墙关键字有效期："
				          hasFeedback
				          >
									{photoExpiresProps}
				        </FormItem>

				        <FormItem
				          {...formItemLayout}
				          label="照片墙上传图片回复消息："
				          hasFeedback
				          >
									{photoRimgProps}
				        </FormItem>

				        <FormItem
				          {...formItemLayout}
				          label="照片墙上传描述回复消息："
				          hasFeedback
				          >
									{photoRtextProps}
				        </FormItem>
		        	</div>
			         <FormItem  {...formItemLayout} label="照片打印：" hasFeedback>
							 		{radio3Props}
			        </FormItem>

			        <FormItem  {...formItemLayout} label="客户服务：" hasFeedback>
									{radio4Props}
			        </FormItem>
			         <div  hidden={this.state.customer_service == 1? false: true}>
			         	<FormItem
				          {...formItemLayout}
				          label="客服关键字："
				          hasFeedback
				          >
									{serviceKeywordProps}
				        </FormItem>

				        <FormItem
				          {...formItemLayout}
				          label="未有客服在线提示信息："
				          hasFeedback
				          >
									{servicePromptProps}
				        </FormItem>
			         </div>
			        <FormItem
       		          {...formItemLayout}
       		          label="上传公众号头像："
       		          hasFeedback
       		          >
   		            	<Upload {...fileProps}>
							<Icon type="plus" />
							<div className="ant-upload-text">头像</div>
						</Upload>
       		        </FormItem>

			        <FormItem  {...formItemLayout}>
			        	<Col offset="8">
	        	        	<Button type="primary" style={{width: 100}} onClick={::this.handleSubmit}>确定</Button>
	        	        	<Button type="ghost" style={{width: 100, marginLeft: 20}} onClick={() => { history.back() }}>返回</Button>
	        			</Col>
			        </FormItem>
				</Form>
			</Spin>
		)
	}
}
