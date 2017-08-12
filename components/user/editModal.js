import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'
import Auth from 'Application/components/auth'


const FormItem = Form.Item

const Option = Select.Option

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const id = this.props.info.id
			const wechatUserMove = values.wechatUserMove.length > 0? values.wechatUserMove.join(): ''
			this.props.group? this.props.changeGroup(id, wechatUserMove): this.props.changeVirtualGroup(id, wechatUserMove)
		})
	}

	checkGroup(rule, value, cb) {
		const { setFieldsValue } = this.props.form
		if(this.props.group && value.length > 3) {
			setFieldsValue({'wechatUserMove': value.slice(0, 3)})
		}else{
			cb()
		}
	}

	renderForm() {

		const { getFieldDecorator } = this.props.form

		const select = this.props.group? this.props.select.toJS().weixinGroup: this.props.select.toJS().virtualGroup
		const group = this.props.group? this.props.info.wechat_groupid: this.props.info.virtual_groupid
		const userGroupList = (group+'').split(',').filter(item => item != 0)
		const info = this.props.info

		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 16
			}
		}

		const wechatUserMoveProps = getFieldDecorator('wechatUserMove', {
			rules: [
				{ validator: ::this.checkGroup}
			],
			initialValue: []
		})(
			<Select mode='multiple' placeholder={this.props.group? "请选择分组(最多三个,若不选则将该用户从所有分组拉出)": "请选择分组(若不选则将该用户从所有分组拉出)"} >
				{
					select.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		return(
			<Form layout='horizontal' >
		        <FormItem
		          {...formItemLayout}
		          label="用户昵称："
		          disabled
		          hasFeedback
		          >
		          <Input value={this.props.info.nickname} disabled/>
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="用户原所在组："
		          hasFeedback
		          >
		          <Select value={userGroupList} mode='multiple'>
	        			{
	        				select.map(item => {
	        					return (
	        							<Option disabled key={item.id} value={item.id+''}>{item.name}</Option>
	        					)
	        				})
	        			}
	    	      </Select>
		        </FormItem>
	        	<FormItem
		          {...formItemLayout}
		          label="修改分组："
		          hasFeedback
		          >
							{wechatUserMoveProps}
		        </FormItem>
			</Form>
		)
	}

	render() {
		return(
			<Modal
				title={this.props.group? '微信分组' : '虚拟分组'}
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				onOk={::this.handleSubmit}
				confirmLoading={this.props.changeLoading}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}
