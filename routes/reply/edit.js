import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ReplyEditComp from 'wechat/components/reply/edit'
import { fetchReplyList, fetchReplyById, updateReplyList } from 'wechat/actions'

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
		info: wechatReply.get('info'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchReplyList, fetchReplyById, updateReplyList, uploadFile }, dispatch)
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
		loading: false,
		updateLoading: false,
		fileLoading: false
	}

	static storeName = 'wechatReply'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchReplyById({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchReplyList() {
		return this.props.actions.fetchReplyList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	fetchReplyById() {
		return this.props.actions.fetchReplyById(...arguments)
	}

	@autoLoading.bind(this, 'fileLoading')
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading
	updateReplyList() {
		return this.props.actions.updateReplyList(...arguments)
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
							fetchReplyById: ::this.fetchReplyById,
							updateReplyList: ::this.updateReplyList,
							uploadFile: ::this.uploadFile
						}} 
						></ReplyEditComp>
					</Spin>
				}
			</div>
		)
	}
}