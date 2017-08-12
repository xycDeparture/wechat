import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'

import Spin from 'antd/lib/spin'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import onError from 'Application/decorators/onError'

import Key from 'Application/decorators/key'

import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'
import Auth from 'Application/components/auth'

const FormItem = Form.Item
const Option = Select.Option

@Key(['content'])
@Form.create()
@onError('fetchGroupList')
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info:{},
			visible_1: false,
			visible_2: false,
			visible_3: false
		}
	}

	static propTypes= {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	toggleModal(info, visible, cb) {
		if(info) {
			if(cb) {
				cb(info)
			}
			this.setState({
				[visible]: !this.state[visible],
				info: info
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
			})
		}
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const type = values.type
	      	const name = values.name
	      	const page = 1
	      	this.context.router.push({
				pathname: '/wechat/group/list',
				query: {
					page: page,
					name: name,
					type: type
				}
			})
			this.props.actions.fetchGroupList({page, name, type})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wechat/group/list',
			query: query
		})
		this.props.actions.fetchGroupList(query)
	}

	handleAdd(info) {
		this.props.actions.addGroupList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})
	}

	handleUpdate(info, id) {
		this.props.actions.updateGroupList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_3: false })
		})
	}

	handleRemove(id) {
		this.props.actions.delGroupList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	toUserGroup(obj) {
		this.context.router.push({
			pathname: '/wechat/group/users',
			query: {
				group_id:obj.group_id,
				gid: obj.id
			}
		})
	}

	getWechatGroup() {
		this.props.actions.getWechatGroup().then(resolve =>{
			message.success(resolve.errormsg)
		}).catch(reject => {
			message.error(reject.err.errormsg)
		})
	}

	renderToolbar() {
		const select = this.props.select.toJS()
		const { getFieldDecorator } = this.props.form

		const nameProps = getFieldDecorator('name', {

		})(
			<Input type="text" placeholder="请输入名称" />
		)

		const typeProps = getFieldDecorator('type', {
		})(
			<Select size="large" placeholder="请选择类型" style={{ width: 150 }} allowClear>
				<Option key={'x'} value="-1">全部</Option>
				{
					select.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)
		return (
			<div className="toolbar">
				<Form layout='inline' >
					<Auth type={["wechat-group-add"]}>
						<Button onClick={() => {this.toggleModal(undefined, 'visible_1')}} type="primary">
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>
					<Auth type={["wechat-group-get-list"]}>
						<Button onClick={::this.getWechatGroup} type="primary">
							<Icon type="plus" />
							拉取微信分组
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>
					<FormItem  label="名称：">
							{nameProps}
		      </FormItem>
					<FormItem  label="类型：">
							{typeProps}
					</FormItem>
						<Button onClick={::this.handleSearch} type="primary" >
							<Icon type="search" />
							 查询
						</Button>
				</Form>
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const params = this.props.params.toJS()
		const select = this.props.select.toJS()
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const toggleModal = (obj, visible, initChildSource) => _ => {
			return this.toggleModal(obj, visible, initChildSource)
		}

		const toUserGroup = obj => _ => {
			return this.toUserGroup(obj)
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '用户数量',
			dataIndex: 'count',
			key: 'count',
			render(count) {
				var num = !count||count <= 0? 0: count
				return (
					<span>{num}</span>
				)
			}
		}, {
			title: '组类型',
			dataIndex: 'type',
			key: 'type',
			render(type) {
				const name = select.find(item => item.id == type).name
				return(
					<span>{name}</span>
				)
			}
		},{
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["wechat-group-check-user"]}>
							<a onClick={toUserGroup(obj)} style={{paddingRight:5}}>查看用户</a>
						</Auth>
						<Auth type={["wechat-group-check"]}>
							<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>查看</a>
						</Auth>
						{
							obj.group_id >= 100 || obj.type == 2 ? [
								<Auth key="1" type={["wechat-group-update"]}>
									<a onClick={toggleModal(obj, 'visible_3')} style={{paddingRight:5}}>编辑</a>
								</Auth>,
								<Auth key="2" type={["wechat-group-delete"]}>
									<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj.id)}>
										<a>删除</a>
									</Popconfirm>
								</Auth>
							] : null
						}

					</div>
				)
			}
		}]

		const pagination = {
			total: +params.count,
			current: +params.page,
			onChange: ::this.handlePageChange,
			showSizeChanger: true,
			pageSize: +params.psize,
			onShowSizeChange: ::this.handlePageChange,
			showTotal: function() {
				return `共${params.count}条`
			}.bind(this)
		}

		return (
			<Table
				dataSource={dataSource}
				columns={columns}
				pagination={ pagination }
			/>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolbar()}
				<Spin spinning={this.props.loading}>
					{this.renderTable()}
				</Spin>
				<AddModal
					visible={this.state.visible_1}
					handleAdd={::this.handleAdd}
					addLoading={this.props.addLoading}
					toggle={::this.toggleModal}
				/>
				<EditModal
						visible={this.state.visible_3}
						handleUpdate={::this.handleUpdate}
						updateLoading={this.props.updateLoading}
						toggle={::this.toggleModal}
						info={this.state.info}
				/>
				<SeeModal
						visible={this.state.visible_2}
						toggle={::this.toggleModal}
						info={this.state.info}
				/>
			</div>
		)
	}
}
