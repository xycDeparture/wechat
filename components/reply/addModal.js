import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'


import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'



import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'


const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
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
			this.props.handleAdd(values)
		})
	}

	renderForm() {
		const editSelect = this.props.editSelect.toJS()

		const { getFieldDecorator } = this.props.form

		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const acidProps = getFieldDecorator('acid', {
			rules: [
				{ required: true, message: '请输入公众号' }
			],
		})(
			<Input type="text" />
		)

		const keywordProps = getFieldDecorator('keyword', {
			rules: [
				{ required: true, message: '请输入关键字' }
			],
		})(
			<Input type="text" />
		)

		const signProps = getFieldDecorator('sign', {
		})(
			<RadioGroup>
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
		})(
			<Select size="large" placeholder="请选择类型：" style={{ width: 150 }}>
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
		})(
			<Select size="large" placeholder="请选择类型：" style={{ width: 150 }}>
				{
					editSelect.replyType.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const contentProps = getFieldDecorator('content_text', {
			rules: [
				{ required: true, message: '请输入文本内容' }
			],
		})(
			<Input type="textarea" rows="6"/>
		)

		return(
			<Form layout='horizontal' >
			        <FormItem
			          {...formItemLayout}
			          label="公众号："
			          disabled
			          hasFeedback
			          >
								{acidProps}
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="关键字："
			          disabled
			          hasFeedback
			          >
								{keywordProps}
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="签到："
			          hasFeedback
			          >
									{signProps}
			        </FormItem>
			        <FormItem  {...formItemLayout} label="事件类型：">
									{typeProps}
		        	</FormItem>
		        	<FormItem  {...formItemLayout} label="回复类型：">
									{replyTypeProps}
		        	</FormItem>
		        	<FormItem
			          {...formItemLayout}
			          label="文本内容："
			          hasFeedback
			          >
								{contentProps}
			        </FormItem>
				</Form>
		)
	}

	render() {
		return(
			<Modal
				title="新增回复"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				confirmLoading={this.props.addLoading}
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}
