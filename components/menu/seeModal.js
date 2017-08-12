import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'



import Select from 'antd/lib/select'



import Modal from 'antd/lib/modal'


const FormItem = Form.Item

const Option = Select.Option

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_3')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}

	renderForm() {

		// const { getFieldProps } = this.props.form
		const info = this.props.info
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}
		return(
			<Form layout='horizontal' >
				<FormItem
				{...formItemLayout}
				label="名称："
				hasFeedback
				>
					<Input value={info.name} readOnly/>
				</FormItem>

				<FormItem
				{...formItemLayout}
				label="类型："
				hasFeedback
				>
	        	<Select
	        	 value={info.type}
	        	 placeholder="请选择类型"
	        	 style={{ width: 180 }}
	        	 readOnly>
	        		{
	        			this.props.select.menuType.map(item => {
	        				return <Option key={item.key} value={item.key}>{item.value}</Option>
	        			})
	        		}
	        	</Select>
        </FormItem>

		        <div hidden={info.type != 'media_id'}>
			        <FormItem
					{...formItemLayout}
					label="素材："
					hasFeedback
					>
	    	        	<Select
	    	        		value={info.value}
	    	        		placeholder="请选择素材"
	    	        		style={{ width: 180 }}
	    	        		readOnly>
	    	        		{
	    	        			this.props.select.allMaterial.map(item => {
	    	        				return <Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        			})
	    	        		}
	    	        	</Select>
			        </FormItem>
				</div>

				<div hidden={info.type != 'view_limited'}>
			        <FormItem
					{...formItemLayout}
					label="图文："
					hasFeedback
					>
	    	        	<Select value={info.value} placeholder="请选择图文" style={{ width: 180 }} readOnly>
	    	        		{
	    	        			this.props.select.allTxt.map(item => {
	    	        				return <Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        			})
	    	        		}
	    	        	</Select>
			        </FormItem>
				</div>
				<div hidden={info.type == 'view_limited' || info.type == 'media_id'}>
					<FormItem
					{...formItemLayout}
					label="内容："
					hasFeedback
					>
						<Input value={info.value} readOnly/>
					</FormItem>
				</div>
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
