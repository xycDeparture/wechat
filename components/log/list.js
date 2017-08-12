import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import format from 'Application/utils/formatDate'

import Button from 'antd/lib/button'

import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import DatePicker from 'antd/lib/date-picker'
import Key from 'Application/decorators/key'


const FormItem = Form.Item

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
			pathname: '/wechat/error-log/list',
			query: query
		})
		this.props.actions.fetchErrorLogList(query)
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const start_time = values.start_time ? format(values.start_time): ''
	      	const end_time = values.end_time ? format(values.end_time): ''
	      	const page = 1
	      	this.context.router.push({
				pathname: '/wechat/error-log/list',
				query: {
					page: page,
					start_time: start_time,
					end_time: end_time,
				}
			})
			this.props.actions.fetchErrorLogList({page, start_time, end_time})
    	})
	}

	renderToolbar() {
		const { getFieldDecorator } = this.props.form

		return (
			<div className="toolbar">
				<Form layout='inline' >
					<FormItem  label="时间：">
							{
								getFieldDecorator('start_time')(
									<DatePicker placeholder="开始时间"/>
								)
							}
					</FormItem>
					<FormItem>
						{
							getFieldDecorator('end_time')(
								<DatePicker placeholder="结束时间"/>
							)
						}
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
		const columns = [{
			title: '错误码',
			dataIndex: 'code',
			key: 'code'
		}, {
			title: '错误说明',
			dataIndex: 'msg',
			key: 'msg'
		}, {
			title: '创建时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render(time) {
				return(
					<span>{format(time*1000)}</span>
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
			</div>
		)
	}

}
