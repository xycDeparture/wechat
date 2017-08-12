import format from 'Application/utils/formatDate'

import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Popconfirm from 'antd/lib/popconfirm'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Switch from 'antd/lib/switch'

import message from 'antd/lib/message'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'

/**
 * 微信－公众号－列表页
 */
@Key(['content'])
export default class ListComp extends React.Component {
	constructor(props, context) {
		super(props, context)
	}
	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired,
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	handleAdd() {
		this.context.router.push('/wechat/public/edit')
	}

	handleUpdate(item) {
		this.context.router.push({
			pathname: '/wechat/public/update',
			query: {
				id: item.id
			}
		})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wechat/public/list',
			query: query
		})
		this.props.actions.fetchPublicList(query)
	}

	handleUpdateItem(item) {
		item.photo_print == 0?item.photo_print = 1: item.photo_print = 0
		this.props.actions.updatePublicList(item, item.id).then(reslove => {
			message.success(reslove.errormsg)
			this.props.actions.fetchPublicList({...this.props.location.query})
		})
	}

	removeItem(id) {
		this.props.actions.delPublicItem(id).then(reslove => {
			message.success(reslove.errormsg)
			// this.props.actions.fetchPublicList({...this.props.location.query})
		})
	}

	authToken() {
		window.location.href = `${this.props.backend_domain}/wechat-platform/auth`
	}

	renderToolbar() {
		return (
			<div className="toolbar">
    			<Auth type={["wechat-account-add"]}>
    				<Button type="primary" onClick={::this.handleAdd}>
    					<Icon type="plus" />
    					添加
    				</Button>
    			</Auth>
    			<span> </span>
    			<Auth type={["wechat-account-auth"]}>
    				<a target="_blank" href={`${this.props.backend_domain}/wechat-platform/auth`}>
    					<Button type="ghost">
    						<Icon type="plus" />
    						平台授权
    					</Button>
    				</a>
    			</Auth>
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const handleUpdateItem = item => _ => {
			return this.handleUpdateItem(item)
		}

		const handleUpdate = item => _ => {
			return this.handleUpdate(item)
		}

		const removeItem = id => _ => {
			return this.removeItem(id)
		}

		const columns = [{
			title: '公众号名称',
			dataIndex: 'nick_name',
			key: 'nick_name'
		}, {
			title: 'token',
			dataIndex: 'token',
			key: 'token'
		}, {
			title: '接口地址',
			dataIndex: 'api_key',
			key: 'api_key'
		}, {
			title: '授权类型',
			dataIndex: 'trust_type',
			key: 'trust_type',
			render(status) {
				return <span>{status > 1? '开发者模式': '第三方授权'}</span>
			}
		}, {
			title: '授权状态',
			dataIndex: 'auth_status',
			key: 'auth_status',
			render(status) {
				return <span>{status < 1 ? '未授权' : '已授权'}</span>
			}

		}, {
			title: '照片打印',
			dataIndex: 'photo_print',
			key: 'photo_print',
			render(status, obj) {
				return	<Auth type={["wechat-account-update"]}>
							<Switch defaultChecked={+status} onChange={handleUpdateItem(obj)} ></Switch>
	    				</Auth>
			}
		}, {
			title: '创建时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render(time) {
				return <span>{format(time * 1000)}</span>
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["wechat-account-update"]}>
							<a onClick={handleUpdate(obj)} style={{paddingRight:5}}>详情</a>
						</Auth>
						<Auth type={["wechat-account-delete"]}>
							<Popconfirm title="确定要删除吗？" onConfirm={removeItem(obj.id)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>
					</div>
				)
			}
		}]
		const params = this.props.params.toJS()
		const { page = 1 } = params
		const pagination = {
			total: params.count,
			current: params.page,
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
				pagination={pagination}
				loading={this.props.loading || this.props.updateLoading}
			/>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
		)
	}

}