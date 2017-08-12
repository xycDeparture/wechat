import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import MediaComp from 'wechat/components/media/list'
import { fetchMediaList, fetchMediaListSelect, removeMedia, getPictureCount } from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'
import Spin from 'antd/lib/spin'

/**
 * 微信－多媒体素材－列表页路由
 */

@connect(
	({ wechatMedia }) => ({ 
		content: wechatMedia.get('content'),
		params: wechatMedia.get('params'),
		pending: wechatMedia.get('pending'),
		validateType: wechatMedia.get('validateType'),
		mediaType: wechatMedia.get('mediaType'),
		error: wechatMedia.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchMediaList, fetchMediaListSelect, removeMedia, getPictureCount }, dispatch)
	})
)

export default class MediaCompRoute extends React.Component {

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchMediaList({ ...props.location.query })),
			redux.dispatch(fetchMediaListSelect())
		])
		
	}

	state = {
		listLoading: false
	}

	static storeName = 'wechatMedia'

	@autoLoading.bind(this, 'listLoading')
	fetchMediaList() {
		return this.props.actions.fetchMediaList(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	removeMedia() {
		return this.props.actions.removeMedia(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	getPictureCount() {
		return this.props.actions.getPictureCount(...arguments)
	}

	render() {
		return (
			<Spin spinning={this.props.pending}>
				{this.props.children? this.props.children: 
				<MediaComp
					{...this.props}
					{...this.state}
					actions={{
						removeMedia: ::this.removeMedia,
						fetchMediaList: ::this.fetchMediaList,
						getPictureCount: ::this.getPictureCount
					}} 
				/>}
			</Spin>
		)
	}
}