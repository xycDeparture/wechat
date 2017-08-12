import React, { PropTypes } from 'react'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'

const FormItem = Form.Item
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

		const msg_type = this.props.info.msg_type
		const selectData = this.props.select.toJS().find(item => item.id === msg_type) || {}
		return(
			<Form horizontal >
			        <FormItem
			          {...formItemLayout}
			          label="公众号："
			          disabled
			          hasFeedback
			          >
			          <Input value={this.props.info.acid_name} readOnly />
			        </FormItem>
			         <FormItem
			          {...formItemLayout}
			          label="消息类型："
			          disabled
			          hasFeedback
			          >
			          <Input value={selectData.name} readOnly />
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="消息内容："
			          hasFeedback
			          >
			          <Input value={this.props.info.content} type="textarea" rows="6" readOnly />
			        </FormItem>
			        <FormItem
			        	{...formItemLayout}
			        	label="图片链接："
			        >
			          <Input value={this.props.info.pic_url} readOnly />
		        	</FormItem>

		        	<FormItem
			          {...formItemLayout}
			          label="语音格式："
			          hasFeedback
			          >
			          <Input value={this.props.info.format} readOnly/>
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
