import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

import SendGroupComp from 'wechat/components/send_group/list'
import { 
	fetchSendGroupList, 
	fetchSendGroupListSelect, 
	fetchSendGroupModalSelect,
	fetchSendPreviewPerson,
	saveSendGroupData, 
	removeSendGroup, 
	updateAudit, 
	sendPreview,
	sendGroupMsg,
	fetchReturnMsg,
    searchPreview,
    removeSearchPreview
} from 'wechat/actions'


/**
 * 微信－渠道－列表页路由
 */

@connect(
	({ wechatSendGroup, application, sendGroupPreview }) => ({ 
		content: wechatSendGroup.get('content'),
		contentSelect: wechatSendGroup.get('contentSelect'),
		modalSelect: wechatSendGroup.get('modalSelect'),
		sendPreviewPerson: wechatSendGroup.get('sendPreviewPerson'),
		send_count: wechatSendGroup.get('send_count'),
		params: wechatSendGroup.get('params'),
		pending: wechatSendGroup.get('pending'),
		error: wechatSendGroup.get('error'),
		auth: application.get('auth'),
        sendGroupPreview: sendGroupPreview.get('content')
	}),
	dispatch => ({
		actions: bindActionCreators({
			fetchSendGroupList,
			fetchSendGroupListSelect,
			fetchSendGroupModalSelect,
			fetchSendPreviewPerson,
			saveSendGroupData,
			removeSendGroup,
			updateAudit,
			sendPreview,
			sendGroupMsg,
			fetchReturnMsg,
            searchPreview,
            removeSearchPreview
		}, dispatch)
	})
)
export default class SendGroupRoute extends React.Component {

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSendGroupList({ ...props.location.query })),
			redux.dispatch(fetchSendGroupListSelect()),
			redux.dispatch(fetchSendGroupModalSelect()),
			redux.dispatch(fetchSendPreviewPerson())
		])
		
	}

	state = {
		listLoading: false,
		loading: false,
		sendPreviewLoading: false,
		editLoading: false,
        searchLoading: false
	}

	static storeName = 'wechatSendGroup'

	@autoLoading.bind(this, 'listLoading')
	fetchSendGroupList() {
		return this.props.actions.fetchSendGroupList(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	fetchSendGroupModalSelect() {
		return this.props.actions.fetchSendGroupModalSelect(...arguments)
	}
	
    @autoLoading.bind(this, 'sendPreviewLoading')
    fetchSendPreviewPerson() {
        return this.props.actions.fetchSendPreviewPerson(...arguments)
    }

	@autoLoading.bind(this, 'editLoading')
	saveSendGroupData() {
		return this.props.actions.saveSendGroupData(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	removeSendGroup() {
		return this.props.actions.removeSendGroup(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	updateAudit() {
		return this.props.actions.updateAudit(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	sendPreview() {
		return this.props.actions.sendPreview(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	sendGroupMsg() {
		return this.props.actions.sendGroupMsg(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	fetchReturnMsg() {
		return this.props.actions.fetchReturnMsg(...arguments)
	}

    @autoLoading.bind(this, 'searchLoading')
    searchPreview() {
        return this.props.actions.searchPreview(...arguments)
    }

    removeSearchPreview() {
        return this.props.actions.removeSearchPreview()
    }

	render() {
		const wechatSendGroup = this.props.wechatSendGroup
		return (
			<Spin spinning={this.props.pending}>
				<SendGroupComp
					{...this.props}
					{...this.state}
					actions={{
						fetchSendGroupList: ::this.fetchSendGroupList,
						fetchSendGroupModalSelect: ::this.fetchSendGroupModalSelect,
						fetchSendPreviewPerson: ::this.fetchSendPreviewPerson,
						saveSendGroupData: ::this.saveSendGroupData,
						removeSendGroup: ::this.removeSendGroup,
						updateAudit: ::this.updateAudit,
						sendPreview: ::this.sendPreview,
						sendGroupMsg: ::this.sendGroupMsg,
						fetchReturnMsg: ::this.fetchReturnMsg,

                        searchPreview: ::this.searchPreview,
                        removeSearchPreview: ::this.removeSearchPreview
					}}
				/>
			</Spin>	
		)
	}
}