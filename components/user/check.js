import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Tag from 'antd/lib/tag'
import Icon from 'antd/lib/icon'
import Spin from 'antd/lib/spin'
const img = require('Application/resources/404.png')

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
    	this.state = {
    		display: true
    	}
  	}


	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

  	handleReset(e) {
  	    e.preventDefault();
  	    this.props.form.resetFields();
  	}

	render() {
		const user = this.props.user.toJS()
		const option = this.props.option.toJS()
		const virtual_groupid = user.virtual_groupid
		const { getFieldDecorator } = this.props.form
		const formItemLayout = {
		    labelCol: { span: 4 },
		    wrapperCol: { span: 10 }
		}
		const userGroupList = user.wechat_groupid? (user.wechat_groupid+'').split(',').filter(item => item != 0): []
		return (
			<Spin spinning={this.props.userLoading}>
				<Form horizontal  style={{ marginTop: 40 }}>
					<FormItem
			          {...formItemLayout}
			          label="公众号："
			          hasFeedback
			          >
			          <Input value={user.acid_name} readOnly/>
			       </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="用户昵称："
			          hasFeedback
			          >
			          <Input value={user.nickname} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="手机号："
			          hasFeedback
			          >
			          <Input value={user.mobile} readOnly/>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="是否验证手机号：">
			         	<Icon type={+user.mobile_check? 'check': 'cross'}/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="OpenID："
			          hasFeedback
			          >
			          <Input value={user.openid} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="性别："
			          hasFeedback
			          >
			          <RadioGroup value={+user.sex} readOnly>
	    	        	{
	    	        		option.sexType.map(item => {
	    	        		return(
	    	        			<Radio key={item.id} value={+item.id}>{item.name}</Radio>
	    	        		)
	    	        	})
	    	        	}
			          </RadioGroup>
			        </FormItem>

			         <FormItem
			          {...formItemLayout}
			          label="城市："
			          hasFeedback
			          >
			          <Input value={user.city} readOnly/>
			        </FormItem>

			         <FormItem
			          {...formItemLayout}
			          label="国家："
			          hasFeedback
			          >
			          <Input value={user.country} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="省份："
			          hasFeedback
			          >
			          <Input value={user.province} readOnly/>
			        </FormItem>

			          <FormItem
			          {...formItemLayout}
			          label="语言："
			          hasFeedback
			          >
			          <Input value={user.language} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="用户头像："
			          hasFeedback
			          >
			          <img className='head-img' src={user.headimgurl? user.headimgurl: img }/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="备注："
			          hasFeedback
			          >
			          <Input value={user.remark} readOnly/>
			        </FormItem>

			       <FormItem  {...formItemLayout} label="微信分组：">
	    	        	{
    	        			userGroupList.map(item => {
    	        				var obj = {}
    	        				option.weixinGroup.forEach(item1 => {
				         			if(item1.id == item) {
				         				obj = item1
				         			}
			         			})
			         			if(obj.id) {
			         				return (
				         				<Tag key={obj.id} color="blue">{obj.name}</Tag>
				         			)
			         			}
		         			})


			         	}
		        	</FormItem>

			         <FormItem  {...formItemLayout} label="用户所在虚拟分组：">
	    	        	{
    	        			user.virtual_groupid.map(item => {
    	        				var obj = {}
    	        				option.virtualGroup.forEach(item1 => {
				         			if(item1.id == item) {
				         				obj = item1
				         			}
			         			})
			         			if(obj.id) {
			         				return (
				         				<Tag key={obj.id} color="blue">{obj.name}</Tag>
				         			)
			         			}
		         			})


			         	}

			        </FormItem>

			         <FormItem  {...formItemLayout} label="用户所属渠道：">
			         	{
			         		user.channelid.map(item => {
    	        				var obj = {}
    	        				option.channelList.forEach(item1 => {
				         			if(item1.id == item) {
				         				obj = item1
				         			}
			         			})
			         			if(obj.id) {
			         				return (
				         				<Tag key={obj.id} color="blue">{obj.name}</Tag>
				         			)
			         			}
		         			})
			         	}
			        </FormItem>

			        <FormItem  {...formItemLayout} label="是否关注：">
			         	<Icon type={+user.subscribe? 'check': 'cross'}/>
			        </FormItem>
				</Form>
			</Spin>
		)
	}
}
