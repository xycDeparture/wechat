
import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import MessageAnsComp from 'wechat/components/statistical/message/message_analysis'
import { fetchMessageAnalysisList } from 'wechat/actions'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－微信统计-接口分析－列表页路由
 */

@connect(
	({ wechatAnalysisMessage, application }) => ({ 
		pending: wechatAnalysisMessage.get('pending'),
		content: wechatAnalysisMessage.get('content'),
		params: wechatAnalysisMessage.get('params'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchMessageAnalysisList }, dispatch)
	})
)

export default class UserCompRoute extends React.Component {

	state = {
		loading: false
	}
	static storeName = 'wechatAnalysisMessage'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchMessageAnalysisList({ ...props.location.query }))
		])
		
	}

	@autoLoading.bind(this, 'loading')
	fetchMessageAnalysisList() {
		return this.props.actions.fetchMessageAnalysisList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<MessageAnsComp
						{...this.state}
						{...this.props}
						
						actions={{
							fetchMessageAnalysisList: ::this.fetchMessageAnalysisList
						}} 
					></MessageAnsComp>
				</Spin>
				}
			</div>	
		)
	}
}