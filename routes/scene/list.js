import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Spin from 'antd/lib/spin'

import SceneComp from 'wechat/components/scene/list'
import { fetchSceneList, editScene } from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'


/**
 * 微信－场景－列表页路由
 */

@connect(
	({ wechatScene }) => ({ 
		content: wechatScene.get('content'),
		params: wechatScene.get('params'),
		pending: wechatScene.get('pending'),
		error: wechatScene.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchSceneList, editScene }, dispatch)
	})
)

export default class SceneRoute extends React.Component {

	state = {
		loading: false,
		submitLoading: false
	}


	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSceneList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchSceneList() {
		return this.props.actions.fetchSceneList(...arguments)
	}

	@autoLoading.bind(this, 'submitLoading')
	editScene() {
		return this.props.actions.editScene(...arguments)
	}


	render() {
		return (
			<Spin spinning={this.props.pending}>
				<SceneComp
					{...this.props}
					{...this.state}
					actions={{
						editScene: ::this.editScene,
						fetchSceneList: ::this.fetchSceneList
					}} 
				/>
			</Spin>
		)
	}
}