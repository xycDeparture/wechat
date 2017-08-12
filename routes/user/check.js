import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import UserComp from 'wechat/components/user/check'
import { fetchSingerUser } from 'wechat/actions'

import Spin  from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ wechatUser }) => ({ 
		user: wechatUser.get('user'),
		option: wechatUser.get('option'),
		pending:  wechatUser.get('pending'),
		id: wechatUser.get('id')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchSingerUser }, dispatch)
	})
)

export default class UserCompRoute extends React.Component {
	constructor(props, context) {
		super(props, context)
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	state = {
		userLoading: false
	}
	static storeName = 'wechatUser'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSingerUser({ ...props.location.query }))
		])
	}

	componentWillMount() {
		const id = this.props.id
		const query = this.context.location.query
		if(id != query.id && id){
			this.fetchSingerUser(query)
		}
	}

	@autoLoading.bind(this, 'userLoading')
	fetchSingerUser() {
		return this.props.actions.fetchSingerUser(...arguments)
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
							fetchSingerUser: ::this.fetchSingerUser
						}} 
					></UserComp>
				</Spin>}
			</div>	
		)
	}
}