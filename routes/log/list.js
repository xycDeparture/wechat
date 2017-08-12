import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ErrorLogComp from 'wechat/components/log/list'

import { fetchErrorLogList } from 'wechat/actions'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－错误码－列表页路由
 */

@connect(
	({ wechatErrorLog }) => ({ 
		pending: wechatErrorLog.get('pending'),
		content: wechatErrorLog.get('content'),
		params: wechatErrorLog.get('params'),

	}),
	dispatch => ({
		actions: bindActionCreators({ fetchErrorLogList }, dispatch)
	})
)

export default class UserCompRoute extends React.Component {

	state = {
		loading: false
	}
	static storeName = 'wechatErrorLog'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchErrorLogList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchErrorLogList() {
		return this.props.actions.fetchErrorLogList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<ErrorLogComp
						{...this.state}
						{...this.props}
						
						actions={{
							fetchErrorLogList: ::this.fetchErrorLogList,
						}} 
					/>
				</Spin>
				}
			</div>	
		)
	}
}