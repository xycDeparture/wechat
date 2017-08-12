import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
const Option = Select.Option
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'
import onError from 'Application/decorators/onError'


import Key from 'Application/decorators/key'
import format from 'Application/utils/formatDate'
import Auth from 'Application/components/auth'

const FormItem = Form.Item

@Key(['content'])
@Form.create()
@onError('fetchMediaList')
export default class MediaComp extends React.Component {
	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,

		validateType: PropTypes.instanceOf(Immutable.List).isRequired,
		mediaType: PropTypes.instanceOf(Immutable.List).isRequired,

		actions: PropTypes.object.isRequired,

		listLoading: PropTypes.bool.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	removeMedia(id) {
		return this.props.actions.removeMedia(id).then(x => message.success(x.errormsg))
	}

	onPageChange(nextPage, pageSize) {
		const query = this.context.location.query
		query.page = nextPage
		query.psize = pageSize
		this.context.router.push({
			pathname: '/wechat/media-material/list',
			query
		})
		this.props.actions.fetchMediaList(query)
	}

	getPictureCount() {
		this.props.actions.getPictureCount('media').then(x => {
			Modal.success({
				title: x.errormsg,
				content: x.result.map((item, key) => <p key={key}>{item}</p>)
			})
		})
	}

	handerSearch() {
		const params = this.props.params.toJS()
		const values = this.props.form.getFieldsValue(['name', 'type', 'media_type'])
		const query = {
			...params,
			...values
		}
		delete query.count

		this.context.router.push({
			pathname: '/wechat/media-material/list',
			query
		})
		this.props.actions.fetchMediaList(query)
	}


	renderToolbar() {
		const { validateType, mediaType } = this.props
		const { form: { getFieldDecorator }, params } = this.props

		const nameProps = getFieldDecorator('name', {
			initialValue: params.get('name')
		})(
			<Input type="text" placeholder="请输入名称" />
		)

		const typeProps = getFieldDecorator('type', {
			initialValue: params.get('type') ? +params.get('type') : undefined
		})(
			<Select placeholder="请选择类型" style={{ width: 150 }} allowClear>
				<Option key={'x'} value="-1">全部</Option>
				{
					validateType.map(item =>
						<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
					)
				}
			</Select>
		)

		const mediaTypeProps = getFieldDecorator('media_type', {
			initialValue: +params.get('media_type') ? +params.get('media_type') : undefined
		})(
			<Select placeholder="请选择类型" style={{ width: 150 }} allowClear>
				<Option key={'x'} value="-1">全部</Option>
				{
					mediaType.map(item =>
						<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
					)
				}
			</Select>
		)

		return (
			<div className="toolbar">
				<Form layout='inline' >
					<Auth type={["wechat-media-material-add"]}>
						<Link to="/wechat/media/edit">
							<Button type="primary">
								<Icon type="plus" />
								添加
							</Button>
						</Link>
					</Auth>
					<span style={{marginLeft:5}}> </span>
					<FormItem  label="名称：">
							{nameProps}
        	</FormItem>
					<FormItem  label="有效期类型：">
							{typeProps}
	        	</FormItem>
	        	<FormItem  label="素材类型：">
								{mediaTypeProps}
	        	</FormItem>
						<Button type="primary" onClick={::this.handerSearch}>
							<Icon type="search" />
							 查询
						</Button>
						<span style={{marginLeft:5}}> </span>
						<Auth type={["wechat-media-material-count"]}>
							<Button type="ghost" onClick={::this.getPictureCount}>
								<Icon type="eye" />
								 获取永久多媒体素材总数
							</Button>
						</Auth>
				</Form>
			</div>
		)
	}


	renderTable() {
		const dataSource = this.props.content.toJS()
		const mediaType = this.props.mediaType

		const removeMedia = id => _ => {
			this.removeMedia(id)
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '素材类型',
			dataIndex: 'media_type_name',
			key: 'media_type_name'
		}, {
			title: '有效期类型',
			dataIndex: 'type_name',
			key: 'type_name',
		}, {
			title: '过期时间',
			dataIndex: 'expire_time',
			key: 'expire_time',
			render(v) {
				return !v ? '' : format(v * 1000, 'yyyy-MM-dd hh:mm:ss')
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
						<Auth
							type={["wechat-media-material-check"]}
						>
							<Link to={{ pathname: '/wechat/media/edit', query: { id: obj.id } }}>详情</Link>
						</Auth>
						{' '}
						<Auth
							type={["wechat-media-material-delete"]}
						>
							<Popconfirm title="确定要删除吗？" onConfirm={removeMedia(obj.id)}>
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
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
		)
	}
}
