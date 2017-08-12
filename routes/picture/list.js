import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import PictureComp from 'wechat/components/picture/list'
import { fetchPictureList, removePictureMaterial, getPictureMessage, synchPicture, getPictureCount } from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－图文素材－列表页路由
 */

@connect(
	({ wechatPicture }) => ({ 
		content: wechatPicture.get('content'),
		params: wechatPicture.get('params'),
		pending: wechatPicture.get('pending'),
		error: wechatPicture.get('error')

	}),
	dispatch => ({
		actions: bindActionCreators({ fetchPictureList, removePictureMaterial, getPictureMessage, synchPicture, getPictureCount }, dispatch)
	})
)

export default class PictureCompRoute extends React.Component {

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchPictureList({ ...props.location.query }))
		])
		
	}

	state = {
		listLoading: false,
		loading: false
	}

	static storeName = 'wechatPicture'

	@autoLoading.bind(this, 'listLoading')
	removePictureMaterial() {
		return this.props.actions.removePictureMaterial(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	fetchPictureList() {
		return this.props.actions.fetchPictureList(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	getPictureMessage() {
		return this.props.actions.getPictureMessage(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	synchPicture() {
		return this.props.actions.synchPicture(...arguments)
	}

	@autoLoading
	getPictureCount() {
		return this.props.actions.getPictureCount(...arguments)
	}

	render() {
		const wechatPicture = this.props.wechatPicture
		return (
			<Spin spinning={this.props.pending}>
				{this.props.children ? this.props.children :
					<PictureComp
						{...this.props}
						{...this.state}
						actions={{
							fetchPictureList: ::this.fetchPictureList,
							removePictureMaterial: ::this.removePictureMaterial,
							getPictureMessage: ::this.getPictureMessage,
							synchPicture: ::this.synchPicture,
							getPictureCount: ::this.getPictureCount
						}} 
					/>	
				}
			</Spin>
		)
	}
}