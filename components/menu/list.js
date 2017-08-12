import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Switch from 'antd/lib/switch'

import Input from 'antd/lib/input'
import Form from 'antd/lib/form'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import onError from 'Application/decorators/onError'
import Key from 'Application/decorators/key'

import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'
import Auth from 'Application/components/auth'

const FormItem = Form.Item

/**
 * 微信－菜单管理－列表页
 */
@Key(['content'])
@Form.create()
@onError('fetchMenuList')
export default class MenuListComp extends React.Component {

	constructor(props, context) {
		super(props, context)
		this.state = {
			info: {},
			visible_1: false,
			visible_2: false,
			visible_3: false,
            expandedRowKeys: []
		}
	}

	static propTypes= {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		location: PropTypes.object.isRequired,
		router: PropTypes.object.isRequired
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
			// this.setState({
			// 	[visible]: !this.state[visible],
			// })
			this.setState({
				[visible]: !this.state[visible],
				info: {}
			})
		}
	}

	handleAdd(info, cb) {
		const params = this.props.params.toJS()
		this.props.actions.addMenuList(info).then(resolve => {
			message.success(resolve.errormsg)
			// this.setState({ visible_1: false, info: {} })
			cb && cb()
			// this.props.actions.fetchMenuList({params: params.page})
		})
	}

	handleUpdate(info, id) {
		const params = this.props.params.toJS()
		this.props.actions.updateMenuList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false, info: resolve.result })
			// this.props.actions.fetchMenuList({params: params.page})
		})
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	const name = values.name
	      	this.context.router.push({
				pathname: '/wechat/menu/list',
				query: {
					page: page,
					name: values.name
				}
			})
			this.props.actions.fetchMenuList({page, name})
    	})
	}

	handleRemove(id) {
		const params = this.props.params.toJS()
		this.props.actions.delMenuList(id).then(resolve => {
			message.success(resolve.errormsg)
			// this.props.actions.fetchMenuList({params: params.page})
		})
	}

    handlePageChange(nextPage, pageSize) {
        const query = this.context.location.query
        if(pageSize){
            query.psize = pageSize
        }
        query.page = nextPage
        this.context.router.push({
            pathname: '/wechat/menu/list',
            query: query
        })
        this.props.actions.fetchMenuList(query)
    }

	changeMneuStauts(id) {
		const params = this.props.params.toJS()
		this.props.actions.updateMenuStauts(id).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchMenuList({page: params.page})
		})
	}

	syncPrimaryMenu() {
		this.props.actions.syncPrimaryMenu().then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	changeSort(obj, type) {
		const menuId = this.context.location.query.menuId
		const id = obj.id
		this.props.actions.updateMenuSort(id, type).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchMenuList(this.context.location.query)
		})
	}

	addChildrenKey(list) {
		list.forEach(item => {
			if(item.children.length != 0) {
				item.children.forEach(item => {
					item.key = item.id
				})
			}
		})
	}

    onExpandedRowsChange = (keys) => {

        this.setState({
            expandedRowKeys: keys
        })
    }

	renderToolbar() {
		const { getFieldDecorator } = this.props.form
		const nameProps = getFieldDecorator('name', {
		})(
			<Input type="text"  placeholder="请输入主菜单名称" style={{height:28}}/>
		)
		return (
			<div className="toolbar">
				<Form layout='inline' >
					<Auth type={["wechat-menu-add"]}>
						<Button type="primary" onClick={() => {this.toggleModal({}, 'visible_1')}}>
							<Icon type="plus" />
							添加主菜单
						</Button>
					</Auth>
					<span>&nbsp; </span>
					<Auth type={["wechat-menu-synch"]}>
						<Button onClick={::this.syncPrimaryMenu} type="ghost">
							<Icon type="plus" />
							 同步主菜单
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>
					<FormItem style={{marginLeft:10}} label="主菜单名称：">
						{nameProps}
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
		this.addChildrenKey(dataSource)
		const select = this.props.select.toJS()
		const toggleModal = (obj, visible, initChildSource) => _ => {
			return this.toggleModal(obj, visible, initChildSource)
		}
		const addFunc = obj => {
			if(obj.parent_id == 0) {
				return (
					<Auth type={["wechat-menu-add"]}>
						<a onClick={toggleModal(obj, 'visible_1')} style={{paddingRight:5}}>添加</a>
					</Auth>
				)
			}
		}

		const typeName = (list, key) => {
			var value = ''
			list.forEach(item => {
				if(item.key == key){
					value = item.value
					return
				}
			})
			return value
		}

		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const changeMneuStauts = id => _ => {
			return this.changeMneuStauts(id)
		}

		const changeSort = (obj, type) => _ => {
			return this.changeSort(obj, type)
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			render(name, obj) {
				var  menu = ''
				if(obj.hasOwnProperty('children')){
					menu = <span> {name}</span>
				}else{
				    menu = <span>|---{name}</span>
				}
				return menu
			}
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			render(status, obj) {
				return(
					<span>{typeName(select.menuType, status)}</span>
				)
			}
		}, {
			title: '排序',
			dataIndex: 'sort',
			key: 'sort',
			render(status, obj) {
				return(
					<div>
						<div><a><Icon onClick={changeSort(obj, 'up')} type="caret-up"/></a></div>
						<div><a><Icon onClick={changeSort(obj, 'down')} type="caret-down"/></a></div>
					</div>
				)
			}
		}, {
			title: '是否启用',
			dataIndex: 'is_enable',
			key: 'is_enable',
			render(is_enable, obj) {
				return <Switch onChange={changeMneuStauts(obj.id)} defaultChecked={+is_enable}></Switch>
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						{addFunc(obj)}
						<Auth type={["wechat-menu-check"]}>
							<a onClick={toggleModal(obj, 'visible_3')} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["wechat-menu-update"]}>
							<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["wechat-menu-delete"]}>
							<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj.id)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>
					</div>
				)
			}
		}]

        const params = this.props.params.toJS()
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
				pagination={pagination}
				loading={this.props.loading}
                expandedRowKeys={this.state.expandedRowKeys}
                onExpandedRowsChange={keys => this.onExpandedRowsChange(keys)}
			/>
		)
	}

	render() {
		const select = this.props.select.toJS()
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<AddModal
					select={select}
					info={this.state.info}
					visible={this.state.visible_1}
					handleAdd={::this.handleAdd}
					addLoading={this.props.addLoading}
					toggle={::this.toggleModal}
				/>
				<EditModal
					select={select}
					visible={this.state.visible_2}
					handleUpdate={::this.handleUpdate}
					updateLoading={this.props.updateLoading}
					toggle={::this.toggleModal}
					info={this.state.info}
				/>
				<SeeModal
					select={select}
					visible={this.state.visible_3}
					toggle={::this.toggleModal}
					info={this.state.info}
				/>
			</div>
		)
	}
}
