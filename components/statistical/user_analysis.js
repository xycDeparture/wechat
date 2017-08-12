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
import moment from 'moment'
const FormItem = Form.Item
const Option = Select.Option

@Key(['content'])
@Form.create()
export default class UserAnsComp extends React.Component {
	constructor(props, context) {
		super(props, context)
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

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wechat/statistical/user/list',
			query: query
		})
		this.props.actions.fetchUserAnalysisList(query)
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const start_time = values.start_time ? format(values.start_time): ''
	      	const end_time = values.end_time ? format(values.end_time): ''
	      	const type = values.type
	      	const page = 1
	      	this.context.router.push({
				pathname: '/wechat/statistical/user/list',
				query: {
					page: page,
					start_time: start_time,
					end_time: end_time,
					type: type
				}
			})
			this.props.actions.fetchUserAnalysisList({page, start_time, end_time, type})
    	})
	}

	exportData(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const start_time = values.start_time ? format(values.start_time): ''
	      	const end_time = values.end_time ? format(values.end_time): ''
	      	const type = type? values.type: ''
			window.location.href = `${this.props.backend_domain}/wechat/wechat-stats-user-analysis/export?type=${type}&start_time=${start_time}&end_time=${end_time}`
    	})

	}

	renderToolbar() {
		const { getFieldDecorator } = this.props.form
		const { query } = this.props.location
		const startTimeProps = getFieldDecorator('start_time', {
			initialValue: query.start_time ? moment(query.start_time) : null
		})(
			<DatePicker placeholder="开始时间"/>
		)

		const endTimeProps = getFieldDecorator('end_time', {
			initialValue: query.end_time ? moment(query.end_time) : null
		})(
			<DatePicker placeholder="结束时间"/>
		)

		const typeProps = getFieldDecorator('type', {

		})(
			<Select size="large" placeholder="请选择类型" style={{ width: 150 }}>
				<Option key={'x'} value="-1">全部</Option>
				<Option value="day">按日</Option>
				<Option value="month">按月</Option>
			</Select>
		)
		return (
			<div className="toolbar">
				<Form layout='inline' >
					<FormItem  label="时间：">
							{startTimeProps}
					</FormItem>
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
					<span> </span>
					<Button onClick={::this.exportData} type="primary" >
						<Icon type="eye" />
						 导出当前数据
					</Button>
				</Form>
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const columns = [{
			title: '公众号',
			dataIndex: 'acid_name',
			key: 'acid_name'
		}, {
			title: '数据日期',
			dataIndex: 'ref_date',
			key: 'ref_date'
		}, {
			title: '新增的用户数量',
			dataIndex: 'new_user',
			key: 'new_user',
		}, {
			title: '取消关注的用户数量',
			dataIndex: 'cancel_user',
			key: 'cancel_user',
		}, {
			title: '净增的用户数量',
			dataIndex: 'net_user',
			key: 'net_user',
		}, {
			title: '总用户量',
			dataIndex: 'cumulate_user',
			key: 'cumulate_user',
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
			</div>
		)
	}

}
