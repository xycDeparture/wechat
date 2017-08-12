import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PictureAnsComp from 'wechat/components/statistical/picture_analysis'

import { fetchPictureAnalysisList } from 'wechat/actions'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－微信统计-接口分析－列表页路由
 */

@connect(
	({ wechatAnalysisPicture, application }) => ({ 
		pending: wechatAnalysisPicture.get('pending'),
		content: wechatAnalysisPicture.get('content'),
		params: wechatAnalysisPicture.get('params'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchPictureAnalysisList }, dispatch)
	})
)

export default class UserCompRoute extends React.Component {

	state = {
		loading: false
	}
	static storeName = 'wechatAnalysisPicture'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchPictureAnalysisList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchPictureAnalysisList() {
		return this.props.actions.fetchPictureAnalysisList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<PictureAnsComp
						{...this.state}
						{...this.props}
						
						actions={{
							fetchPictureAnalysisList: ::this.fetchPictureAnalysisList
						}} 
					></PictureAnsComp>
				</Spin>
				}
			</div>	
		)
	}
}