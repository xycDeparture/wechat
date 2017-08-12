import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PictureEditComp from 'wechat/components/picture/edit'
import { uploadFile } from 'Application/actions'
import { 
	fetchPictureMaterialById,
	saveMaterial 
} from 'wechat/actions'

import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－图文素材－编辑
 */

@connect(
	({ wechatPicture, application }) => ({ 
		content: wechatPicture.get('editData'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ uploadFile, saveMaterial }, dispatch)
	})
)
export default class PictureEditCompRoute extends React.Component {

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchPictureMaterialById({ ...props.location.query }))
		])
	}

	state = {
		globalLoading: false,
		saveLoading: false
	}

	@autoLoading.bind(this, 'globalLoading')
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading.bind(this, 'saveLoading')
	saveMaterial() {
		return this.props.actions.saveMaterial(...arguments)
	}

	render() {
		return (
			<PictureEditComp 
				{...this.props}
				{...this.state}
				actions={{
					uploadFile: ::this.uploadFile,
					saveMaterial: ::this.saveMaterial
				}}
			/>
		)
	}
}