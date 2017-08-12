import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import format from 'Application/utils/formatDate'

import Button from 'antd/lib/button'

import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import DatePicker from 'antd/lib/date-picker'

import Key from 'Application/decorators/key'
import moment from 'moment'
const FormItem = Form.Item


@Key(['content'])
@Form.create()
export default class PictureAnsComp extends React.Component {
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
			pathname: '/wechat/statistical/picture/detail',
			query: query
		})
		this.props.actions.fetchPictureAnalysisDetail(query)
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	var  start_time = values.start_time
	      	var  end_time = values.end_time
	      	start_time = start_time? format(start_time): ''
	      	end_time = end_time? format(end_time): ''
	      	const the_time = this.context.location.query.the_time
	      	const type = this.context.location.query.type? this.context.location.query.type: 'day'
	      	const page = 1
	      	this.context.router.push({
				pathname: '/wechat/statistical/picture/detail',
				query: {
					page: page,
					start_time: start_time,
					end_time: end_time,
					type: type,
					the_time: the_time
				}
			})
			this.props.actions.fetchPictureAnalysisDetail({page, start_time, the_time, end_time})
    	})
	}

	exportData(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	var  start_time = this.context.location.query.start_time
	      	var  end_time = this.context.location.query.end_time
	      	const type = this.context.location.query.type? this.context.location.query.type: 'day'
	      	const the_time = this.context.location.query.the_time
			window.location.href = `${this.props.backend_domain}/wechat/wechat-stats-txt-analysis-detail/export?type=${type}&start_time=${start_time}&end_time=${end_time}&the_time=${the_time}`
    	})

	}

	renderToolbar() {
		const { getFieldDecorator } = this.props.form

		const query = this.context.location.query
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
		return (
			<div className="toolbar">
				<Form layout='inline' >
				<span hidden={query.type == 'month'? false: true}>
					<FormItem  label="时间：">
							{startTimeProps}
					</FormItem>
					<FormItem>
							{endTimeProps}
		      </FormItem>
					<Button onClick={::this.handleSearch} type="primary" >
						<Icon type="search" />
						 查询
					</Button>
					<span> </span>
				</span>
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
			title: '图文标题',
			dataIndex: 'title',
			key: 'title',
		}, {
			title: '图文页的阅读人数',
			dataIndex: 'int_page_read_user',
			key: 'int_page_read_user',
		}, {
			title: '图文页的阅读次数',
			dataIndex: 'int_page_read_count',
			key: 'int_page_read_count',
		}, {
			title: '原文页的阅读人数',
			dataIndex: 'ori_page_read_user',
			key: 'ori_page_read_user',
		}, {
			title: '原文页的阅读次数',
			dataIndex: 'ori_page_read_count',
			key: 'ori_page_read_count',
		}, {
			title: '分享人数',
			dataIndex: 'share_user',
			key: 'share_user',
		}, {
			title: '分享次数',
			dataIndex: 'share_count',
			key: 'share_count',
		}, {
			title: '收藏人数',
			dataIndex: 'add_to_fav_user',
			key: 'add_to_fav_user',
		}, {
			title: '收藏次数',
			dataIndex: 'add_to_fav_count',
			key: 'add_to_fav_count',

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
