import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import InterfaceAnsComp from 'wechat/components/statistical/interface_analysis'
import { fetchInterfaceAnalysisList } from 'wechat/actions'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－微信统计-接口分析－列表页路由
 */

@connect(
	({ wechatAnalysisInterface, application }) => ({ 
		pending: wechatAnalysisInterface.get('pending'),
		content: wechatAnalysisInterface.get('content'),
		params: wechatAnalysisInterface.get('params'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchInterfaceAnalysisList }, dispatch)
	})
)

export default class UserCompRoute extends React.Component {

	state = {
		loading: false
	}
	static storeName = 'wechatAnalysisInterface'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchInterfaceAnalysisList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchInterfaceAnalysisList() {
		return this.props.actions.fetchInterfaceAnalysisList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<InterfaceAnsComp
						{...this.state}
						{...this.props}
						
						actions={{
							fetchInterfaceAnalysisList: ::this.fetchInterfaceAnalysisList
						}} 
					></InterfaceAnsComp>
				</Spin>
				}
			</div>	
		)
	}
}