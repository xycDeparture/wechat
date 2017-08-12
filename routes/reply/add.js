import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ReplyEditComp from 'wechat/components/reply/add'
import { fetchReplyList, addReplyList } from 'wechat/actions'

import Spin  from 'antd/lib/spin'

import { uploadFile } from  'Application/actions'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ wechatReply, application }) => ({ 
		pending:  wechatReply.get('pending'),
		select: wechatReply.get('select'),
		editSelect: wechatReply.get('editSelect'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchReplyList, addReplyList, uploadFile}, dispatch)
	})
)

export default class UserCompRoute extends React.Component {

	state = {
		loading: false,
		fileLoading: false
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
	addReplyList() {
		return this.props.actions.addReplyList(...arguments)

	}

	@autoLoading.bind(this, 'fileLoading')
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
					<Spin spinning={this.props.pending}>
						<ReplyEditComp
						{...this.props}
						{...this.state}
						actions={{
							fetchReplyList: ::this.fetchReplyList,
							addReplyList: ::this.addReplyList,
							uploadFile: ::this.uploadFile
						}} 
						></ReplyEditComp>
					</Spin>
				}
			</div>
		)
	}
}