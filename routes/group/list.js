import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'wechat/components/group/list'
import { 
	fetchGroupList,
	addGroupList,
	updateGroupList,
	delGroupList,
	getWechatGroup
	 } from 'wechat/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ wechatGroup }) => ({ 
		content: wechatGroup.get('content'),
		params: wechatGroup.get('params'),
		pending:  wechatGroup.get('pending'),
		select: wechatGroup.get('select'),
		error: wechatGroup.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchGroupList, addGroupList, updateGroupList, delGroupList,getWechatGroup }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false
	}
	static storeName = 'wechatGroup'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchGroupList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchGroupList() {
		return this.props.actions.fetchGroupList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addGroupList() {
		return this.props.actions.addGroupList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateGroupList() {
		return this.props.actions.updateGroupList(...arguments)
	}

	@autoLoading
	delGroupList() {
		return this.props.actions.delGroupList(...arguments)
	}

	getWechatGroup() {
		return this.props.actions.getWechatGroup(...arguments)
	}

	render() {
		const wechatGroup = this.props.wechatGroup
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<GroupComp
					{...this.props}
					{...this.state}
					actions={{
						fetchGroupList: ::this.fetchGroupList,
						addGroupList: ::this.addGroupList,
						updateGroupList: ::this.updateGroupList,
						delGroupList: ::this.delGroupList,
						getWechatGroup: ::this.getWechatGroup
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}