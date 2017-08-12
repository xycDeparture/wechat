import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import UserAnsComp from 'wechat/components/statistical/user_analysis'

import { fetchUserAnalysisList, fetchUserAnalysisExport } from 'wechat/actions'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－微信统计-接口分析－列表页路由
 */

@connect(
	({ wechatAnalysisUser, application }) => ({ 
		pending: wechatAnalysisUser.get('pending'),
		content: wechatAnalysisUser.get('content'),
		params: wechatAnalysisUser.get('params'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchUserAnalysisList, fetchUserAnalysisExport }, dispatch)
	})
)

export default class UserCompRoute extends React.Component {

	state = {
		loading: false
	}
	static storeName = 'wechatAnalysisUser'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchUserAnalysisList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchUserAnalysisList() {
		return this.props.actions.fetchUserAnalysisList(...arguments)
	}
	fetchUserAnalysisExport() {
		return this.props.actions.fetchUserAnalysisExport(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<UserAnsComp
						{...this.state}
						{...this.props}
						
						actions={{
							fetchUserAnalysisList: ::this.fetchUserAnalysisList,
							fetchUserAnalysisExport: ::this.fetchUserAnalysisExport
						}} 
					></UserAnsComp>
				</Spin>
				}
			</div>	
		)
	}
}