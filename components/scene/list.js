import React, { PropTypes } from 'react'



import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Modal from 'antd/lib/modal'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'

import Auth from 'Application/components/auth'

import Key from 'Application/decorators/key'

const FormItem = Form.Item

@Key(['content'])
@Form.create()
export default class SceneComp extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		modalVisible: false,
		editData: {}
	}

	hideEditScene() {
		this.setState({
			modalVisible: false
		})
		this.props.form.resetFields()
	}

	showEditScene(editData = {}) {
		this.setState({
			modalVisible: true,
			editData
		})
	}

	editScene() {
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
			this.props.actions.editScene(postData).then(err => {
				message.success(err.errormsg)
				this.props.form.resetFields()
				this.setState({
					modalVisible: false,
					editData: {}
				})
			})
		})
	}

	delScene(id) {
		const act = 'delete'
		this.props.actions.editScene({ id, act }).then(err => {
			message.success(err.errormsg)
		})
	}

	// 查询列表
	handleSearch(nextPage = this.props.params.get('page'), pageSize = this.props.params.get('psize')) {
		const query = {
			psize: pageSize,
			page: nextPage,
			name: this.props.form.getFieldValue('searchName')
		}

		this.context.router.push({
			pathname: '/wechat/scene/list',
			query
		})

		this.props.actions.fetchSceneList(query)
	}

	renderToolbar() {
		const nameProps = this.props.form.getFieldDecorator('searchName', {
			initialValue: this.props.params.get('name')
		})(
			<Input type="text" placeholder="请输入名字" />
		)

		return (
			<div className="toolbar">
				<Form layout='inline'>
					<Auth type={["wechat-scene-add"]}>
						<FormItem>
							<Button type="primary" onClick={this.showEditScene.bind(this, {})}>
								<Icon type="plus" />
								添加
							</Button>
						</FormItem>
					</Auth>

					<FormItem  label="名称：">
							{nameProps}
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
		const editScene = obj => _ => {
			return this.showEditScene(obj)
		}
		const delScene = id => _ => {
			return this.delScene(id)
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
				return (
					<div>
						<Auth type={["wechat-scene-check", "wechat-scene-update"]}>
							<a onClick={editScene(obj)}>编辑</a>
						</Auth>
						{' '}
						<Auth type={["wechat-scene-delete"]} >
							<Popconfirm title="确定要删除吗？" onConfirm={delScene(obj.id)}>
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

		const nameProps = getFieldDecorator('name', {
			rules: [
		       { required: true, message: '请输入名称' },
			],
			initialValue: data.name
		})(
			<Input type="text" placeholder="请输入名称" />
		)

		const remarkProps = getFieldDecorator('remark', {
			rules: [
		       { required: true, message: '请输入备注' },
			],
			initialValue: data.remark
		})(
			<Input type="textarea" rows="6" placeholder="请输入备注" />
		)

		return (
			<Modal
				visible={this.state.modalVisible}
				title={Object.keys(this.state.editData).length ? '编辑' : '添加'}
				onCancel={::this.hideEditScene}
				footer={[
					<Button key="back" type="ghost" size="large" onClick={::this.hideEditScene}>返 回</Button>,
					<Auth key="submit" type={["wechat-scene-update"]} >
						<Button type="primary" size="large" loading={this.props.submitLoading} onClick={::this.editScene}>
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
				{this.renderToolbar()}
				{this.renderTable()}
				{this.renderModal()}
			</div>
		)
	}
}
