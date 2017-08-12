import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'


import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'




import Modal from 'antd/lib/modal'


const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option


@Form.create()
//TODO回复暂时用文本
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_3')
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
			initialValue: this.props.info.acid
		})(
			<Input />
		)

		const keywordProps = getFieldDecorator('keyword', {
			initialValue: this.props.info.keyword
		})(
			<Input />
		)

		const sidProps = getFieldDecorator('sid', {
			initialValue: this.props.info.sid
		})(
			<Select placeholder="请选择类型：" style={{ width: 150 }}>
				{
					editSelect.signName.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const signProps = getFieldDecorator('sign', {
			initialValue: this.props.info.sign
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
			initialValue: this.props.info.type
		})(
			<Select placeholder="请选择类型：" style={{ width: 150 }}>
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
			initialValue: this.props.info.reply_type
		})(
			<Select placeholder="请选择类型：" style={{ width: 150 }}>
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
			initialValue: this.props.info.content
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
			          label="签到状态："
			          hasFeedback
			          >
									{signProps}
			        </FormItem>
			        <FormItem  {...formItemLayout} label="签到名称：">
									{sidProps}
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
				title="编辑"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				confirmLoading={this.props.updateLoading}
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}
