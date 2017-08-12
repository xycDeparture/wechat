import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Spin from 'antd/lib/spin'

import ChannelComp from 'wechat/components/channel/list'
import { fetchChannelList, editChannel } from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'


/**
 * 微信－渠道－列表页路由
 */

@connect(
	({ wechatChannel }) => ({ 
		content: wechatChannel.get('content'),
		params: wechatChannel.get('params'),
		pending: wechatChannel.get('pending'),
		error: wechatChannel.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchChannelList, editChannel }, dispatch)
	})
)

export default class ChannelRoute extends React.Component {

	state = {
		loading: false,
		submitLoading: false
	}


	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchChannelList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchChannelList() {
		return this.props.actions.fetchChannelList(...arguments)
	}

	@autoLoading.bind(this, 'submitLoading')
	editChannel() {
		return this.props.actions.editChannel(...arguments)
	}


	render() {
		return (
			<Spin spinning={this.props.pending}>
				<ChannelComp
					{...this.props}
					{...this.state}
					actions={{
						editChannel: ::this.editChannel,
						fetchChannelList: ::this.fetchChannelList
					}} 
				/>
			</Spin>
		)
	}
}