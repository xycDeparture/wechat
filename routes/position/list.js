import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Spin from 'antd/lib/spin'

import PositionComp from 'wechat/components/position/list'
import { fetchPositionList, editPosition } from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'


/**
 * 微信－场景－列表页路由
 */

@connect(
	({ wechatPosition }) => ({ 
		content: wechatPosition.get('content'),
		params: wechatPosition.get('params'),
		pending: wechatPosition.get('pending'),
		error: wechatPosition.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchPositionList, editPosition }, dispatch)
	})
)

export default class PositionRoute extends React.Component {

	state = {
		loading: false,
		submitLoading: false
	}


	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchPositionList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchPositionList() {
		return this.props.actions.fetchPositionList(...arguments)
	}

	@autoLoading.bind(this, 'submitLoading')
	editPosition() {
		return this.props.actions.editPosition(...arguments)
	}


	render() {
		return (
			<Spin spinning={this.props.pending}>
				<PositionComp
					{...this.props}
					{...this.state}
					actions={{
						editPosition: ::this.editPosition,
						fetchPositionList: ::this.fetchPositionList
					}} 
				/>
			</Spin>
		)
	}
}