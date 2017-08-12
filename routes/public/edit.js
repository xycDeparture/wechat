import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import  Spin  from 'antd/lib/spin'
import EditComp from 'wechat/components/public/edit'
import { getSelectList, addPublicList } from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'

import { uploadFile } from  'Application/actions'


/**
 * 微信－公众号－添加
 */
@connect(
	({ wechatPublic, application }) => ({ 
		pending: wechatPublic.get('pending'),
		select: wechatPublic.get('select'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
	}),
	dispatch => ({
		actions: bindActionCreators({ getSelectList, addPublicList, uploadFile }, dispatch)
	})
)

export default class EditRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		fileLoading: false
	}

	static storeName = 'wechatPublic'
	
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(getSelectList( ...props.location.query ))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchPublicList() {
		return this.props.actions.getSelectList( ...arguments )
	}

	@autoLoading.bind(this, 'addLoading')
	addPublicList() {
		return this.props.actions.addPublicList( ...arguments )
	}

	@autoLoading.bind(this, 'fileLoading')
	uploadFile() {
		return this.props.actions.uploadFile( ...arguments )
	}

	render() {
		return (
			<Spin spinning={this.props.pending}>
				<EditComp
					{...this.props}
					{...this.state}
					actions={{
						fetchPublicList: ::this.fetchPublicList,
						addPublicList: ::this.addPublicList,
						uploadFile: ::this.uploadFile
					}}
				/>
			</Spin>
		)
	}
}


 