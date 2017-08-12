import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import MessageDetailComp from 'wechat/components/statistical/message/reply_detail'
import { fetchMessageAnalysisDetail } from 'wechat/actions'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－微信统计-接口分析－列表页路由
 */

@connect(
	({ wechatAnalysisMessageDetail, application }) => ({ 
		pending: wechatAnalysisMessageDetail.get('pending'),
		content: wechatAnalysisMessageDetail.get('content'),
		params: wechatAnalysisMessageDetail.get('params'),
		select: wechatAnalysisMessageDetail.get('select'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchMessageAnalysisDetail }, dispatch)
	})
)

export default class UserCompRoute extends React.Component {

	state = {
		loading: false
	}
	static storeName = 'wechatAnalysisMessageDetail'
	static fillStore(redux, props) {
		redux.dispatch(fetchMessageAnalysisDetail({ ...props.location.query }))
	}

	@autoLoading.bind(this, 'loading')
	fetchMessageAnalysisDetail() {
		return this.props.actions.fetchMessageAnalysisDetail(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<MessageDetailComp
						{...this.state}
						{...this.props}
						
						actions={{
							fetchMessageAnalysisDetail: ::this.fetchMessageAnalysisDetail
						}} 
					></MessageDetailComp>
				</Spin>
				}
			</div>	
		)
	}
}