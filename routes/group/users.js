import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import GroupUserComp from 'wechat/components/group/users'

import { 
	fetchUserGroupList,
	updateWechatGroup,
	updateVirtualGroup,
	cancelWechatUser
	 } from 'wechat/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－微信分组－查看用户
 */

@connect(
	({ wechatGroupUser }) => ({ 
		users: wechatGroupUser.get('users'),
		select: wechatGroupUser.get('select'),
		params: wechatGroupUser.get('params'),
		pending:  wechatGroupUser.get('pending'),
		gid: wechatGroupUser.get('gid')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchUserGroupList, updateWechatGroup, updateVirtualGroup, cancelWechatUser }, dispatch)
	})
)

export default class EditRoute extends React.Component {

	constructor(props, context) {
		super(props, context)
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}
	static storeName = 'wechatGroupUser'
	state = {
		loading: false,
		updateLoading: false,
	}

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchUserGroupList({ ...props.location.query }))
		])
	}

	componentWillMount() {
		const gid = this.props.gid
		const query = this.context.location.query
		if(gid != query.gid && gid){
			this.fetchUserGroupList(query)
		}
	}

	@autoLoading.bind(this, 'loading')
	fetchUserGroupList() {
		return this.props.actions.fetchUserGroupList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateWechatGroup() {
		return this.props.actions.updateWechatGroup(...arguments)
	}

	@autoLoading.bind(this, 'changeLoading')
	updateVirtualGroup() {
		return this.props.actions.updateVirtualGroup(...arguments)
	}

	@autoLoading
	cancelWechatUser() {
		return this.props.actions.cancelWechatUser(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<GroupUserComp
					{...this.props}
					{...this.state}
					actions={{
						fetchUserGroupList: ::this.fetchUserGroupList,
						updateWechatGroup: ::this.updateWechatGroup,
						updateVirtualGroup: ::this.updateVirtualGroup,
						cancelWechatUser: ::this.cancelWechatUser
					}} 
					>
					</GroupUserComp>
				</Spin>
				}
			</div>
		)
	}
}