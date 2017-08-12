import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import format from 'Application/utils/formatDate'

import Button from 'antd/lib/button'

import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import DatePicker from 'antd/lib/date-picker'
import Select from 'antd/lib/select'
import Key from 'Application/decorators/key'

import SeeModal from './seeModal'


const FormItem = Form.Item
const Option = Select.Option

@Key(['content'])
@Form.create()
export default class UserAnsComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info: {},
			visible_1: false
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
			this.setState({
				[visible]: !this.state[visible],
			})
		}
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wechat/statistical/message/detail',
			query: query
		})
		this.props.actions.fetchMessageAnalysisDetail(query)
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const start_time = values.start_time? format(values.start_time):''
	      	const end_time = values.end_time? format(values.end_time):''
	      	const type = values.type
	      	const page = 1
	      	this.context.router.push({
				pathname: '/wechat/statistical/message/detail',
				query: {
					page: page,
					start_time: start_time,
					end_time: end_time,
					type: type
				}
			})
			this.props.actions.fetchMessageAnalysisDetail({page, start_time, end_time, type})
    	})
	}


	renderToolbar() {
		const select = this.props.select.toJS()
		const { getFieldDecorator } = this.props.form

		const startTimeProps = getFieldDecorator('start_time', {

		})(
			<DatePicker placeholder="开始时间"/>
		)

		const endTimeProps = getFieldDecorator('end_time', {

		})(
			<DatePicker placeholder="结束时间"/>
		)

		const typeProps = getFieldDecorator('type', {

		})(
			<Select  placeholder="请选择类型" style={{ width: 150 }}>
				{
					select.map(item => {
						return(
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)
		return (
			<div className="toolbar">
				<Form layout='inline'>
					<FormItem  label="时间：">
							{startTimeProps}
					</FormItem>
					<span> </span>
					<FormItem>
							{endTimeProps}
        	</FormItem>
        	<FormItem  label="查询类型：">
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
		const getNameById = (list, id) => {
			const obj = list.find(item => {
				return item.id == id
			})
			return obj.name
		}

		const toggleModal = (obj, visible, initChildSource) => _ => {
			return this.toggleModal(obj, visible, initChildSource)
		}

		const dataSource = this.props.content.toJS()
		const select = this.props.select.toJS()
		const columns = [{
			title: '公众号',
			dataIndex: 'acid_name',
			key: 'acid_name'
		}, {
			title: '用户昵称',
			dataIndex: 'uid_name',
			key: 'uid_name'
		}, {
			title: '消息类型',
			dataIndex: 'msg_type',
			key: 'msg_type',
			render(id) {
				return(
					<span>{getNameById(select, id)}</span>
				)
			}
		}, {
			title: '回复时间',
			dataIndex: 'last_update_time',
			key: 'last_update_time',
			render(date) {
				return(
					<span>{format(date*1000)}</span>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return(
					<a onClick={toggleModal(obj, 'visible_1')}>查看</a>
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
			pageSize: params.psize,
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
			/>
		)
	}

	render() {
		return(
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<SeeModal
					info={this.state.info}
					visible={this.state.visible_1}
					toggle={::this.toggleModal}
					select={this.props.select}
				/>
			</div>
		)
	}

}
