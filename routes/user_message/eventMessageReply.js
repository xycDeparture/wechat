import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ReplyComp from 'wechat/components/user_message/eventMessageReply'
import autoLoading from 'Application/decorators/autoLoading'
import { 
    fetchEventReplyData,
    fetchEventReplySelect,
    searchKeywordEventReply,
    eventReplySubmit
} from 'wechat/actions'
import {
	uploadFile
} from 'Application/actions'
@connect(
	({ wechatEventMessage, application }) => ({
	    replyData: wechatEventMessage.get('replyData'),
		replySelectData: wechatEventMessage.get('replySelectData'),
		assets_domain: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({
		    fetchEventReplyData,
			fetchEventReplySelect,
			searchKeywordEventReply,
			eventReplySubmit,
			uploadFile
		}, dispatch)
	})
)
export default class ReplyRoute extends React.Component {
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchEventReplySelect()),
			redux.dispatch(fetchEventReplyData({ ...props.location.query }))
		])
	}

	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

    searchKeywordEventReply() {
        return this.props.actions.searchKeywordEventReply(...arguments)
    }
    
    eventReplySubmit() {
        return this.props.actions.eventReplySubmit(...arguments)
    }
    
	render() {
		return (
			<ReplyComp
				{...this.props}
				{...this.state}
				actions={{
					uploadFile: ::this.uploadFile,
					searchKeywordEventReply: ::this.searchKeywordEventReply,
					eventReplySubmit: ::this.eventReplySubmit
				}}
			/>
		)
	}
}
