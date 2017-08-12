import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ReplyComp from 'wechat/components/reply/list'
import { fetchReplyList, addReplyList, delReplyList, updateReplyList } from 'wechat/actions'

import Spin  from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ wechatReply }) => ({ 
		content: wechatReply.get('content'),
		params: wechatReply.get('params'),
		pending:  wechatReply.get('pending'),
		select: wechatReply.get('select'),
		error: wechatReply.get('error'),
		editSelect: wechatReply.get('editSelect')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchReplyList, addReplyList, delReplyList, updateReplyList }, dispatch)
	})
)

export default class UserCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false
	}

	static storeName = 'wechatReply'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchReplyList({ ...props.location.query }))
		])
		
	}

	@autoLoading.bind(this, 'loading')
	fetchReplyList() {
		return this.props.actions.fetchReplyList(...arguments)
	}

	@autoLoading
	delReplyList() {
		return this.props.actions.delReplyList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addReplyList() {
		return this.props.actions.addReplyList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateReplyList() {
		return this.props.actions.updateReplyList(...arguments)
	}

	render() {
		const wechatReply = this.props.wechatReply
		return (
			<div>
				{this.props.children? this.props.children: 
					<Spin spinning={this.props.pending}>
						<ReplyComp
						{...this.props}
						{...this.state}
						actions={{
							fetchReplyList: ::this.fetchReplyList,
							delReplyList: ::this.delReplyList,
							addReplyList: ::this.addReplyList,
							updateReplyList: ::this.updateReplyList
						}} 
						></ReplyComp>
					</Spin>
				}
			</div>
		)
	}
}