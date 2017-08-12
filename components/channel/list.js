import React, { PropTypes } from 'react'



import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Modal from 'antd/lib/modal'

import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'

import Auth from 'Application/components/auth'

import Key from 'Application/decorators/key'

const FormItem = Form.Item

@Key(['content'])
@Form.create()
export default class ChannelComp extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		modalVisible: false,
		editData: {}
	}

	hideEditChannel() {
		this.setState({
			modalVisible: false
		})
		this.props.form.resetFields()
	}

	showEditChannel(editData = {}) {
		this.setState({
			modalVisible: true,
			editData
		})
	}

	editChannel() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}

			let data = {}
			if (Object.keys(this.state.editData).length) {
				data.id = this.state.editData.id
				data.act = 'update'
			}

			const postData = {
				...values,
				...data
			}
			this.props.actions.editChannel(postData).then(err => {
				message.success(err.errormsg)
				this.props.form.resetFields()
				this.setState({
					modalVisible: false,
					editData: {}
				})
			})
		})
	}

	delChannel(id) {
		const act = 'delete'
		this.props.actions.editChannel({ id, act }).then(err => {
			message.success(err.errormsg)
		})
	}

	// 查询列表
	handleSearch(nextPage = this.props.params.get('page'), pageSize = this.props.params.get('psize')) {
		console.info(this.props.form.getFieldValue('searchName'))
		const query = {
			psize: pageSize,
			page: nextPage,
			name: this.props.form.getFieldValue('searchName')
		}
		this.context.router.push({
			pathname: '/wechat/channel/list',
			query
		})

		this.props.actions.fetchChannelList(query)
	}

	renderToolbar() {
		const { getFieldDecorator } = this.props.form

		const nameProps = getFieldDecorator('searchName', {
			initialValue: this.props.params.get('name')
		})

		return (
			<div className="toolbar">
				<Form layout='inline'>
					<Auth type={["wechat-channel-add"]}>
						<FormItem>
							<Button type="primary" onClick={this.showEditChannel.bind(this, {})}>
								<Icon type="plus" />
								添加
							</Button>
						</FormItem>
					</Auth>

					<span style={{marginLeft:5}}> </span>
					<FormItem  label="名称：">
					{nameProps(
	    	        	<Input type="search" placeholder="请输入名称" />
			        )}
		        	</FormItem>
		        	<FormItem>
	    	        	<Button type="primary" onClick={this.handleSearch.bind(this, undefined, undefined)}>
							<Icon type="search" />
							 搜索
						</Button>
		        	</FormItem>

				</Form>
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const editChannel = obj => _ => {
			return this.showEditChannel(obj)
		}
		const delChannel = id => _ => {
			return this.delChannel(id)
		}
		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '备注',
			dataIndex: 'remark',
			key: 'remark'
		},{
			title: '操作',
			key: 'operation',
			render(_, obj) {
				// const authConfig = {
				// 	dpid: obj.dpid,
				// 	nid: obj.nid,
				// 	cpid: obj.cpid,
				// 	uid: obj.create_user
				// }

				return (
					<div>
						<Auth type={["wechat-channel-check", "wechat-channel-update"]}>
							<a onClick={editChannel(obj)}>详情</a>
						</Auth>
						{' '}
						<Auth type={["wechat-channel-delete"]} >
							<Popconfirm title="确定要删除吗？" onConfirm={delChannel(obj.id)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>
					</div>
				)
			}
		}]

		const params = this.props.params
		const pagination = {
			pageSize: +params.get('psize'),
			current: +params.get('page'),
			onChange: ::this.handleSearch,
			showSizeChanger: true,
			onShowSizeChange: ::this.handleSearch,
			total: +params.get('count'),
			showTotal: function() {
				return `共${params.get('count')}条`
			}.bind(this)
		}

		return (
			<Table
				dataSource={dataSource}
				columns={columns}
				loading={this.props.loading}
				pagination={pagination}
			/>
		)
	}

	renderModal() {
		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 20 }
		}

		const { getFieldDecorator } = this.props.form
		const data = this.state.editData
		return (
			<Modal
				visible={this.state.modalVisible}
				title={Object.keys(this.state.editData).length ? '编辑' : '添加'}
				onCancel={::this.hideEditChannel}
				footer={[
					<Button key="back" type="ghost" size="large" onClick={::this.hideEditChannel}>返 回</Button>,
					<Auth key="submit" type={["wechat-channel-update"]} >
						<Button type="primary" size="large" loading={this.props.submitLoading} onClick={::this.editChannel}>
							提 交
						</Button>
					</Auth>
				]}
			>
				<Form layout='horizontal' >
					<FormItem
						{...formItemLayout}
						label="名称："
						hasFeedback
					>
					{getFieldDecorator('name', {
			            rules: [{ required: true, message: '请输入名称' }],
			            initialValue: data.name
			          })(
			            <Input type="text" placeholder="请输入名称" />
			          )}
			        </FormItem>
			        <FormItem
						{...formItemLayout}
						disabled
						label="备注："
						hasFeedback
					>
					{getFieldDecorator('remark', {
			            rules: [{ required: true, message: '请输入备注' }],
			            initialValue: data.remark
			          })(
			            <Input type="textarea" rows="6" placeholder="请输入备注" />
			          )}
			        </FormItem>

				</Form>
			</Modal>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				{this.renderModal()}
			</div>
		)
	}
}
