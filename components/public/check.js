import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()

export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
	}

	renderForm() {

		const { getFieldDecorator } = this.props.form

		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const roleList = ['微信操作员', '微信管理员', '运营人员']
		return(
			<Form horizontal >
				<FormItem
					{...formItemLayout}
					label="账户："
					hasFeedback
				>
					<Input value={this.props.info.username} readOnly/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="角色名："
					hasFeedback
				>
					<Select size="large" placeholder="请选择" value={roleList[this.props.info.role-1]} style={{ width: 150 }} disabled>
		        		<Option value="1">微信操作员</Option>
				        <Option value="2">微信管理员</Option>
				        <Option value="3">运营人员</Option>
	    	        </Select>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="密码："
					hasFeedback
				>
					<Input value={this.props.info.password} readOnly/>
				</FormItem>
			</Form>
		)
	}

	render() {
		return(
			<Modal
				title="查看"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				onOk={::this.handleCancel}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}
