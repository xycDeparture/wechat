import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'
const FormItem = Form.Item
const RadioGroup = Radio.Group
import safeString from 'safeString'

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
		this.props.handleUpdate(values, this.props.info.id)
		})
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

		// const nameProps = getFieldDecorator('name', {
		// 	rules: [
		// 		{ required: true, message: '请输入名称' }
		// 	],
		// 	initialValue: this.props.info.name
		// })(
		//
		// )
		//
		// const typeProps = getFieldDecorator('type', {
		// 	initialValue: this.props.info.type
		// })
		//
		// const remarkProps = getFieldDecorator('remark', {
		// 	rules: [
		// 		{ required: true, message: '请输入备注内容' }
		// 	],
		// 	initialValue: this.props.info.remark
		// })

		return(
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="名称："
		          disabled
		          hasFeedback
		          >
		          <Input value={this.props.info.name} readOnly/>
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="类型："
		          hasFeedback
		          >
		            <RadioGroup value={safeString(this.props.info.type)} readOnly>
	                  	<Radio  value="1">微信分组</Radio>
	                  	<Radio  value="2">虚拟分组</Radio>
		            </RadioGroup>
		        </FormItem>
	        	<FormItem
		          {...formItemLayout}
		          label="备注："
		          hasFeedback
		          >
		          <Input value={this.props.info.remark+''} readOnly type="textarea" rows="6"/>
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
				confirmLoading={this.props.updateLoading}
				onOk={::this.handleCancel}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}
