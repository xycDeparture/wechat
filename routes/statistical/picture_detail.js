import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PictureDetailComp from 'wechat/components/statistical/picture_detail'

import { fetchPictureAnalysisDetail } from 'wechat/actions'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－微信统计-接口分析－列表页路由
 */

@connect(
	({ wechatAnalysisPictureDetail, application}) => ({ 
		pending: wechatAnalysisPictureDetail.get('pending'),
		content: wechatAnalysisPictureDetail.get('content'),
		params: wechatAnalysisPictureDetail.get('params'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchPictureAnalysisDetail }, dispatch)
	})
)

export default class UserCompRoute extends React.Component {

	state = {
		loading: false
	}
	static storeName = 'wechatAnalysisPictureDetail'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchPictureAnalysisDetail({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchPictureAnalysisDetail() {
		return this.props.actions.fetchPictureAnalysisDetail(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<PictureDetailComp
						{...this.state}
						{...this.props}
						
						actions={{
							fetchPictureAnalysisDetail: ::this.fetchPictureAnalysisDetail
						}} 
					></PictureDetailComp>
				</Spin>
				}
			</div>	
		)
	}
}