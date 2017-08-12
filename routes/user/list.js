import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import UserComp from 'wechat/components/user/list'
import { 
	fetchUserList,
	fetchSingerUser,
	pullWechatUser,
	updateWechatGroup,
	updateVirtualGroup,
	 } from 'wechat/actions'

import Spin  from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ wechatUser, application }) => ({ 
		content: wechatUser.get('content'),
		select: wechatUser.get('select'),
		params: wechatUser.get('params'),
		pending:  wechatUser.get('pending'),
		backend_domain: application.getIn(['user', 'backend_domain']),
		error: wechatUser.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchUserList, fetchSingerUser, pullWechatUser, updateWechatGroup, updateVirtualGroup }, dispatch)
	})
)

export default class UserCompRoute extends React.Component {

	state = {
		loading: false,
		userLoading: false,
		changeLoading: false
	}
	static storeName = 'wechatUser'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchUserList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchUserList() {
		return this.props.actions.fetchUserList(...arguments)
	}

	@autoLoading.bind(this, 'userLoading')
	fetchSingerUser() {
		return this.props.actions.fetchSingerUser(...arguments)
	}
	@autoLoading.bind(this, 'changeLoading')
	updateWechatGroup() {
		return this.props.actions.updateWechatGroup(...arguments)
	}

	@autoLoading.bind(this, 'changeLoading')
	updateVirtualGroup() {
		return this.props.actions.updateVirtualGroup(...arguments)
	}

	pullWechatUser() {
		return this.props.actions.pullWechatUser(...arguments)
	}


	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<UserComp
						{...this.props}
						{...this.state}
						actions={{
							fetchUserList: ::this.fetchUserList,
							fetchSingerUser: ::this.fetchSingerUser,
							pullWechatUser: ::this.pullWechatUser,
							updateWechatGroup: ::this.updateWechatGroup,
							updateVirtualGroup: ::this.updateVirtualGroup
						}} 
					></UserComp>
				</Spin>}
			</div>	
		)
	}
}