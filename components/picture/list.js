import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'

import Spin from 'antd/lib/spin'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import format from 'Application/utils/formatDate'
import Key from 'Application/decorators/key'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'
import onError from 'Application/decorators/onError'


import Auth from 'Application/components/auth'


const FormItem = Form.Item
@Key(['content'])
@onError('fetchPictureList')
export default class PictureComp extends React.Component {
	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		modalVisible: false,
		dataSource: []
	}

	handleRemove(id) {
		this.props.actions.removePictureMaterial(id).then(x => {
			message.success(x.errormsg)
		})
	}

	getPictureMessage(obj) {
		this.props.actions.getPictureMessage(obj.media_id).then(x => {
			const dataSource = x.result.news_item.map((item, index) => {
				item.key = index
				return item
			})
			this.shownModal(dataSource, obj.name)
		})
	}

	synchPicture(id) {
		this.props.actions.synchPicture(id).then(x => {
			message.success(x.errormsg)
		})
	}

	getPictureCount() {
		this.props.actions.getPictureCount('txt').then(x => {
			Modal.success({
				title: x.errormsg,
				content: x.result
			})
		})
	}

	onPageChange(nextPage, pageSize) {
		this.context.router.push({
			pathname: '/wechat/picture-material/list',
			query: {
				page: nextPage,
				psize: pageSize
			}
		})
		this.props.actions.fetchPictureList({
			page: nextPage,
			psize: pageSize
		})
	}

	shownModal(dataSource, modalTitle) {
		this.setState({
			modalVisible: true,
			dataSource,
			modalTitle
		})
	}

	hideModal() {
		this.setState({
			modalVisible: false
		})
	}

	renderToolbar() {
		return (
			<div className="toolbar">
				<Form layout='inline'>
					<Auth
						type={["wechat-txt-material-add"]}
					>
						<Link to="/wechat/picture-material/edit">
							<Button type="primary">
								<Icon type="plus" />
								添加
							</Button>
						</Link>
					</Auth>


					<span style={{marginLeft:5}}> </span>
					{/*<FormItem  label="名称：">
	    	        	<Input type="text"/>
		        	</FormItem>*/}
		        		{/* TODO 查询功能还没做 */}
						{/*<Button>
							<Icon type="search" />
							 查询
						</Button>*/}
					<Auth type={["wechat-txt-material-info"]}>
						<Button type="ghost" onClick={::this.getPictureCount}>
							<Icon type="calculator" />
							 获取图文素材总数
						</Button>
					</Auth>

				</Form>
			</div>
		)
	}

	renderModal() {
		const columns = [{
			title: '标题',
			dataIndex: 'title',
			key: 'title'
		},{
			title: '作者',
			dataIndex: 'author',
			key: 'author'
		},{
			title: '操作',
			render(_, obj) {
				return <a href={obj.url} target="_blank">查看</a>
			}
		}]

		return (
			<Modal
				title={this.state.modalTitle}
				visible={this.state.modalVisible}
				onCancel={::this.hideModal}
				onOk={::this.hideModal}

			>
				<Table
					columns={columns}
					dataSource={this.state.dataSource}
					size="small"
					pagination={false}
				/>
			</Modal>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()


		const handleRemove = id => _ => {
			this.handleRemove(id)
		}

		const getPictureMessage = obj => _ => {
			this.getPictureMessage(obj)
		}

		const synchPicture = id => _ => {
			this.synchPicture(id)
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		},  {
			title: '创建时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render(val) {
				return format(val * 1000, 'yyyy-MM-dd hh:mm:ss')
			}
		}, {
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
						<Auth type={["wechat-txt-material-synch"]}>
							<a onClick={synchPicture(obj.id)}>同步</a>
						</Auth>
						{' '}
						<Auth type={["wechat-txt-material-check"]}>
							<Link to={{ pathname: '/wechat/picture-material/edit', query: { id: obj.id } }}>详情</Link>
						</Auth>
						{' '}
						{obj.media_id &&
						<Auth
							type={["wechat-txt-material-delete"]}
						>
							<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj.id)}>
								<a>删除</a>
							</Popconfirm>

						</Auth>}
						{' '}
						<Auth
							type={["wechat-txt-material-delete"]}
						>
							<a onClick={getPictureMessage(obj)}>获取图文内容信息</a>
						</Auth>

					</div>
				)
			}
		}]
		const params = this.props.params
		const pagination = {
			pageSize: +params.get('psize'),
			current: +params.get('page'),
			onChange: ::this.onPageChange,
			showSizeChanger: true,
			onShowSizeChange: ::this.onPageChange,
			total: +params.get('count'),
			showTotal: function() {
				return `共${params.get('count')}条`
			}.bind(this)
		}

		return (
			<Table
				dataSource={dataSource}
				columns={columns}
				loading={this.props.listLoading}
				pagination={pagination}
			/>
		)
	}


	render() {
		return (
			<Spin spinning={this.props.loading}>
				{this.renderToolbar()}
				{this.renderTable()}
				{this.renderModal()}
			</Spin>
		)
	}
}
