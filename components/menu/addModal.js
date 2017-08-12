import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'
import Popover from 'antd/lib/popover'
const FormItem = Form.Item
const Option = Select.Option

import Emoji from 'Application/components/emoji'


@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			type: '',
            menuNameValue: ''
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
        this.props.form.resetFields()
        this.setState({
            menuNameValue: ''
        })
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			if(this.props.info){
				values.parent_id = this.props.info.id
				values.type = this.state.type
				if(values.type == 'media_id') values.value = values.media
				if(values.type == 'view_limited') values.value = values.view
			}else{
				values.parent_id = 0
			}
			this.props.handleAdd(values, ::this.handleCancel)
			// console.log(values, 'form')
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}

	onChangeType(value) {
		this.setState({
			type: value
		})
	}

	// checkMenuName(rule, value = '', callback) {
	//     const { validateFields } = this.props.form
	//     if (Object.keys(this.props.info).length == 0 && value.replace(/[^\x00-\xff]/g, "**").length > 10) {
	//       callback('一级菜单名称不得大于15字节')
	//     }
	//     if(Object.keys(this.props.info).length > 0  && value.replace(/[^\x00-\xff]/g, "**").length > 16) {
	//       callback('二级级菜单名称不得大于24字节')
	//     }
	//     callback()
	// }
    handleEmojiClick(emoji) {
		const form = this.props.form
		form.setFieldsValue({
			name: (form.getFieldValue('name') || '') + emoji
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

		const nameProps = getFieldDecorator('name', {
			rules: [
				{ required: true, message: '请输入菜单名称' }
			]
		})(
			<Input />
		)

		const contentProps = getFieldDecorator('value', {

		})(
			<Input />
		)

		const typeProps = getFieldDecorator('type', {
			rules: [
				{ required: true, message: '请选择类型' }
			],
			onChange: ::this.onChangeType
		})(
			<Select  placeholder="请选择类型" style={{ width: 180 }}>
				{
					this.props.select.menuType.map(item => {
						return <Option key={item.key} value={item.key}>{item.value}</Option>
					})
				}
			</Select>
		)

		const mediaProps = getFieldDecorator('media', {

		})(
			<Select
			 showSearch
			 notFoundContent="无法找到"
			 optionFilterProp="children"
			 placeholder="请选择素材"
			 style={{ width: 180 }}
			 >
				{
					this.props.select.allMaterial.map(item => {
						return <Option key={item.id} value={item.id+''}>{item.name}</Option>
					})
				}
			</Select>
		)

		const viewProps = getFieldDecorator('view', {

		})(
			<Select
			 showSearch
			 notFoundContent="无法找到"
			 optionFilterProp="children"
			 placeholder="请选择图文"
			 style={{ width: 180 }}
			 >
				{
					this.props.select.allTxt.map(item => {
						return <Option key={item.id} value={item.id+''}>{item.name}</Option>
					})
				}
			</Select>
		)



		return(
			<Form layout='horizontal' >
				<FormItem
				{...formItemLayout}
				label="名称："
				hasFeedback
				>
					{nameProps}
	        <Popover content={<Emoji onClick={::this.handleEmojiClick}/>} placement="bottom" title="emoji图标" trigger="click">
	            <a>emoji图标</a>
	        </Popover>
				</FormItem>

				<FormItem
				{...formItemLayout}
				label="类型："
				hasFeedback
				>
					{typeProps}
		        </FormItem>

		       <div hidden={this.state.type != 'media_id'}>
			        <FormItem
							{...formItemLayout}
							label="素材："
							hasFeedback
							>
								{mediaProps}
			        </FormItem>
				</div>

				<div hidden={this.state.type != 'view_limited'}>
			        <FormItem
							{...formItemLayout}
							label="图文："
							hasFeedback
							>
								{viewProps}
			        </FormItem>
				</div>

				<div hidden={this.state.type == 'view_limited' || this.state.type == 'media_id' }>
					<FormItem
					{...formItemLayout}
					label="内容："
					hasFeedback
					>
						{contentProps}
					</FormItem>
				</div>

			</Form>
		)
	}

	render() {
		return(
			<Modal
				title="新增菜单"
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
