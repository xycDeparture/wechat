import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ReplyComp from 'wechat/components/user_message/reply'
import autoLoading from 'Application/decorators/autoLoading'
import { 
    fetchReplyData,
    fetchReplySelect,
    searchKeywordReplyList,
    replySubmit
} from 'wechat/actions'
import {
	uploadFile
} from 'Application/actions'
@connect(
	({ wechatTextMessage, application }) => ({
	    replyData: wechatTextMessage.get('replyData'),
		replySelectData: wechatTextMessage.get('replySelectData'),
		assets_domain: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({
		    fetchReplyData,
			fetchReplySelect,
			searchKeywordReplyList,
			replySubmit,
			uploadFile
		}, dispatch)
	})
)
export default class ReplyRoute extends React.Component {
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchReplySelect()),
			redux.dispatch(fetchReplyData({ ...props.location.query }))
		])
	}

	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

    searchKeywordReplyList() {
        return this.props.actions.searchKeywordReplyList(...arguments)
    }
    
    replySubmit() {
        return this.props.actions.replySubmit(...arguments)
    }
    
	render() {
		return (
			<ReplyComp
				{...this.props}
				{...this.state}
				actions={{
					uploadFile: ::this.uploadFile,
					searchKeywordReplyList: ::this.searchKeywordReplyList,
					replySubmit: ::this.replySubmit
				}}
			/>
		)
	}
}
