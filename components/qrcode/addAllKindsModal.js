import React, { PropTypes } from 'react'
import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import message from 'antd/lib/message'

const FormItem = Form.Item
@Form.create()
export default class AddSceneComp extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	}

    handleCancel() {
        this.props.toggle(undefined, 'visible')
        this.props.form.resetFields()
    }
    
    handleSubmit() {
        this.props.form.validateFields((err, values) => {
            if(err) {
                return
            }
            const data = {
                name: values.name,
                remark: values.remark
            }
            const modalName = this.props.info
            this.props.form.resetFields()
            
            switch(modalName) {
                case 'sceneModal':
                    this.props.actions.addWechatScene(data)
                    break
                case 'channelModal':
                    this.props.actions.addChannel(data)
                    break
                case 'wechatGroupModal':
                    this.props.actions.addWechatGroup(data)
                    break
                case 'virtualGroupModal':
                    this.props.actions.addVirtualGroup(data)
                    break
                case 'positionModal':
                    this.props.actions.addPosition(data)
                    break
            }
           
        })
    }
    
	renderModal() {
		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 20 }
		}
		const { getFieldDecorator } = this.props.form
		
		const nameProps = getFieldDecorator('name', {
			rules: [
		       { required: true, message: '请输入名称' },
			]
		})(
			<Input type="text" placeholder="请输入名称" />
		)

		const remarkProps = getFieldDecorator('remark', {
			rules: [
		       { required: true, message: '请输入备注' },
			]
		})(
			<Input type="textarea" rows="6" placeholder="请输入备注" />
		)
		return (
			<Modal
			    visible={this.props.visible}
				title="添加"
				onCancel={::this.handleCancel}
				onOk={::this.handleSubmit}
			>
				<Form layout='horizontal'>
					<FormItem
						{...formItemLayout}
						label="名称："
						hasFeedback
					>
						{nameProps}
			        </FormItem>
			        <FormItem
						{...formItemLayout}
						label="备注："
						hasFeedback
					>
						{remarkProps}
			     </FormItem>
				</Form>
			</Modal>
		)
	}

	render() {
		return (
			<div>
				{this.renderModal()}
			</div>
		)
	}
}
