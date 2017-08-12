import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Popover from 'antd/lib/popover'
import Modal from 'antd/lib/modal'
import Emoji from 'Application/components/emoji'

const FormItem = Form.Item

const Option = Select.Option
@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			type: '',
            menuNameValue: ''
		}
	}

    handleEmojiClick(emoji) {
		const form = this.props.form
		form.setFieldsValue({
			name: (form.getFieldValue('name') || '') + emoji
		})
    }

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	onChangeType(value) {
		this.setState({
			type: value
		})
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.type = this.state.type
			if(values.type == 'media_id') values.value = values.media
			if(values.type == 'view_limited') values.value = values.view
			this.props.handleUpdate(values, this.props.info.id)
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
		if(nextProps.info.id && !this.props.visible ) {
			this.setState({
				type: nextProps.info.type,
                menuNameValue: nextProps.info.name
			})
		}
	}

	// checkMenuName(rule, value = '', callback) {
	//     const { validateFields } = this.props.form
	//     if (this.props.info.parent_id == 0 && value.replace(/[^\x00-\xff]/g, "**").length > 10) {
	//       callback('一级菜单名称不得大于15字节')
	//     }
	//     if(this.props.info.parent_id != 0  && value.replace(/[^\x00-\xff]/g, "**").length > 16) {
	//       callback('二级级菜单名称不得大于24字节')
	//     }
	//     callback()
	//  }



	renderForm() {

		const { getFieldDecorator } = this.props.form

		const info = this.props.info

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
				{ required: true, message: '请输入菜单名名称' }
			],
			initialValue: info.name
		})(
			<Input />
		)

		const contentProps = getFieldDecorator('value', {
			initialValue: info.type != 'media_id' && info.type != 'view_limited'? info.value: ''
		})(
			<Input />
		)

		const typeProps = getFieldDecorator('type', {
			rules: [
				{ required: true, message: '请选择菜单类型' }
			],
			initialValue: info.type
		})(
			<Select onChange={::this.onChangeType} placeholder="请选择类型" style={{ width: 180 }}>
				{
					this.props.select.menuType.map(item => {
						return <Option key={item.key} value={item.key}>{item.value}</Option>
					})
				}
			</Select>
		)

		const mediaProps = getFieldDecorator('media', {
			initialValue:info.type == 'media_id'? info.value: ''
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
			initialValue: info.type == 'view_limited'? info.value: ''
		})(
			<Select
			 showSearch
			 notFoundContent="无法找到"
			 optionFilterProp="children"
			 placeholder="请选择图文"
			 style={{ width: 180 }}>
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
