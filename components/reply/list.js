import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Spin from 'antd/lib/spin'
import Popconfirm from 'antd/lib/popconfirm'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'

import Key from 'Application/decorators/key'
import onError from 'Application/decorators/onError'
import addModal from './addModal'
import message from 'antd/lib/message'

import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'
import Auth from 'Application/components/auth'


const FormItem = Form.Item
const Option = Select.Option

@Key(['content'])
@Form.create()
@onError('fetchReplyList')
export default class ReplyComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			psize: 10,
			info: {},
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

	toChildRoute(path, id) {
		if(id) {
			this.context.router.push({
				pathname: path,
				query: {
					id: id
				}
			})
		}else{
			this.context.router.push({pathname: path})
		}

	}

	handlePageSizeChange(current, pageSize) {
		const page = current
		const psize = pageSize
		this.setState({
			psize: pageSize
		})
		this.context.router.push({
			pathname: '/wechat/reply/list',
			query: {
				page: page,
				psize: psize
			}
		})
		this.props.actions.fetchReplyList({page, psize})
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	this.context.router.push({
				pathname: '/wechat/reply/list',
				query: {
					page,
					...values
				}
			})

			this.props.actions.fetchReplyList({page, ...values})
    	})
	}

	handleAdd(info) {
		this.props.actions.addReplyList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})
	}

	handleUpdate(info, id) {
		this.props.actions.updateReplyList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_3: false })
		})
	}


	handleRemove(id) {
		this.props.actions.delReplyList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	handlePageChange(nextPage) {
		const query = this.context.location.query
		query.page = nextPage
		// console.log(query)
		this.context.router.push({
			pathname: '/wechat/reply/list',
			query
		})
		this.props.actions.fetchReplyList(query)
	}


	renderToolbar() {
		const { getFieldDecorator } = this.props.form

    const { mstchingType } = this.props.editSelect.toJS()
		const select = this.props.select.toJS()

    const mstchingProps = getFieldDecorator('mstching_type')(
			<Select size="large" placeholder="请选择匹配类型" style={{ width: 150 }} allowClear>
					<Option key={'x'} value="-1">全部</Option>
					{
							mstchingType.map(item =>
									<Option key={item.id} value={item.id+''}>{item.name}</Option>
							)
					}
			</Select>
		)
		const keywordProps = getFieldDecorator('name', {
		})(
			<Input size="large" placeholder="请输入关键字查询"/>
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
					<Auth type={["wechat-reply-add"]}>
						<Button onClick={() => {this.toChildRoute('/wechat/reply/add')}} type="primary">
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>
					<FormItem  label="类型：">
							{typeProps}
		     	</FormItem>
          <FormItem  label="匹配类型：">
							{mstchingProps}
          </FormItem>
					<span style={{marginLeft:5}}> </span>
		        	<FormItem  label="关键字：">
									{keywordProps}
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
		const {evenType, replyType, sceneList} = this.props.editSelect.toJS()
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const toggleModal = (obj, visible, initChildSource) => _ => {
			return this.toggleModal(obj, visible, initChildSource)
		}

		const toChildRoute = (path, query) => _ => {
			return this.toChildRoute(path, query)
		}
		const columns = [{
			title: '事件类型',
			dataIndex: 'type',
			key: 'type',
			render(status) {
				const event_type = evenType.find(item => item.id == status)
				const name = event_type? event_type.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
            title: '匹配类型',
            dataIndex: 'mstching_type',
            key: 'mstching_type',
            render(value) {
                return {
                    '1': '模糊查询',
                    '2': '精确查询'
                }[value]
            }
        }, {
			title: '场景',
			dataIndex: 'scene',
			key: 'scene',
			render(status) {
				const scene_type = sceneList.find(item => item.id == status)
				const name = scene_type? scene_type.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '关键字',
			dataIndex: 'keyword',
			key: 'keyword',
			render(keyword) {
			const name = keyword? keyword: <Icon type="ellipsis"/>
				return (
					<span>{name}</span>
				)
			}
		}, {
			title: '回复类型',
			dataIndex: 'reply_type',
			key: 'reply_type',
			render(status) {
				const reply_type = replyType.find(item => item.id == status)
				const name = reply_type? reply_type.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["wechat-reply-check"]}>
							<a onClick={toChildRoute('/wechat/reply/check', obj.id)} style={{paddingRight:5}}>详情</a>
						</Auth>
						<Auth type={["wechat-reply-update"]}>
							<a onClick={toChildRoute('/wechat/reply/edit', obj.id)} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["wechat-reply-delete"]} dpid={obj.dpid} nid={obj.nid} cpid={obj.cpid} uid={obj.create_user}>
							<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj.id)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>
					</div>
				)
			}
		}]

		const pagination = {
			total: params.count,
			current: params.page,
			onChange: ::this.handlePageChange,
			showSizeChanger: true,
			pageSize: +params.psize,
			onShowSizeChange: ::this.handlePageSizeChange,
			showTotal: function() {
				return `共${params.count}条`
			}.bind(this)
		}

		return (
			<Table
				dataSource={dataSource}
				columns={columns}
				pagination={pagination}
			/>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolbar()}
				<Spin spinning={this.props.loading}>
					{this.renderTable()}
					<AddModal
						visible={this.state.visible_1}
						handleAdd={::this.handleAdd}
						editSelect={this.props.editSelect}
						addLoading={this.props.addLoading}
						toggle={::this.toggleModal}
					/>
					<EditModal
						visible={this.state.visible_3}
						handleUpdate={::this.handleUpdate}
						editSelect={this.props.editSelect}
						updateLoading={this.props.updateLoading}
						toggle={::this.toggleModal}
						info={this.state.info}
					/>
					<SeeModal
						editSelect={this.props.editSelect}
						visible={this.state.visible_2}
						toggle={::this.toggleModal}
						info={this.state.info}
					/>
				</Spin>
			</div>
		)
	}
}
