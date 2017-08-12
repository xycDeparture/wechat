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
const Option = Select.Option

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	renderForm() {
		const editSelect = this.props.editSelect.toJS()

		// const { getFieldProps } = this.props.form

		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		// const acidProps = getFieldProps('acid', {
		// 	initialValue: this.props.info.acid
		// })
		//
		// const keywordProps = getFieldProps('keyword', {
		// 	initialValue: this.props.info.keyword
		// })
		//
		// const signProps = getFieldProps('sign', {
		// 	initialValue: this.props.info.sign
		// })
		//
		// const typeProps = getFieldProps('type', {
		// 	initialValue: this.props.info.type
		// })
		//
		// const replyTypeProps = getFieldProps('reply_type', {
		// 	initialValue: this.props.info.reply_type
		// })
		//
		// const contentProps = getFieldProps('content_text', {
		// 	initialValue: this.props.info.content
		// })

		return(
			<Form layout='horizontal' >
			        <FormItem
			          {...formItemLayout}
			          label="公众号："
			          disabled
			          hasFeedback
			          >
			          <Input value={this.props.info.acid} readOnly />
			        </FormItem>
			         <FormItem
			          {...formItemLayout}
			          label="关键字："
			          disabled
			          hasFeedback
			          >
			          <Input value={this.props.info.keyword} readOnly />
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="签到："
			          hasFeedback
			          >
			            <RadioGroup value={this.props.info.sign} readOnly>
		                  	{
			            		editSelect.signType.map(item => {
			            			return (
		                  				<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
			            			)
			            		})
			            	}
			            </RadioGroup>
			        </FormItem>
			        <FormItem  {...formItemLayout} label="签到名称：">
	    	        	<Select  value={this.props.info.sid} readOnly placeholder="请选择类型：" style={{ width: 150 }}>
	    	        		{
	    	        			editSelect.signName.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
			        <FormItem  {...formItemLayout} label="事件类型：">
	    	        	<Select value={ this.props.info.type} readOnly placeholder="请选择类型：" style={{ width: 150 }}>
	    	        		{
	    	        			editSelect.evenType.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem  {...formItemLayout} label="回复类型：">
	    	        	<Select value={this.props.info.reply_type} readOnly placeholder="请选择类型：" style={{ width: 150 }}>
	    	        		{
	    	        			editSelect.replyType.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem
			          {...formItemLayout}
			          label="文本内容："
			          hasFeedback
			          >
			          <Input value={this.props.info.content} readOnly type="textarea" rows="6"/>
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
