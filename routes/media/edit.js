import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MediaEditComp from 'wechat/components/media/edit'
import autoLoading from 'Application/decorators/autoLoading'

import { fetchMediaListSelect, fetchWechatMediaById, saveWechatMedia } from 'wechat/actions'
import { uploadFile } from 'Application/actions'


/**
 * 微信－多媒体－编辑
 */
@connect(
	({ wechatMedia, application }) => ({ 
		editData: wechatMedia.get('editData'),
		validateType: wechatMedia.get('validateType'),
		mediaType: wechatMedia.get('mediaType'),

		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchMediaListSelect, uploadFile, saveWechatMedia }, dispatch)
	})
)
export default class MediaRoute extends React.Component {
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchWechatMediaById({ ...props.location.query })),
			redux.dispatch(fetchMediaListSelect())
		])
	}

	state = {
		loading: false
	}

	@autoLoading
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading
	saveWechatMedia() {
		return this.props.actions.saveWechatMedia(...arguments)
	}

	render() {
		return (
			<MediaEditComp 
				{...this.props}
				{...this.state}
				actions={{
					uploadFile: ::this.uploadFile,
					saveWechatMedia: ::this.saveWechatMedia
				}}
			/>
		)
	}
}


 