import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import  Spin  from 'antd/lib/spin'
import UpdateComp from 'wechat/components/public/update'
import { getSelectList, fetchInfoById, updatePublicList } from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'
import { uploadFile } from  'Application/actions'


/**
 * 微信－公众号－修改
 */
@connect(
	({ wechatPublic, application }) => ({ 
		pending: wechatPublic.get('pending'),
		select: wechatPublic.get('select'),
		info: wechatPublic.get('info'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ getSelectList, fetchInfoById, updatePublicList, uploadFile }, dispatch)
	})
)

export default class EditRoute extends React.Component {

	constructor(props, context) {
		super(props, context)
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}


	state = {
		loading: false,
		fileLoading: false
	}

	static storeName = 'wechatPublic'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(getSelectList( { ...props.location.query } )),
			redux.dispatch(fetchInfoById( { ...props.location.query } )),
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchInfoById() {
		return this.props.actions.fetchInfoById( ...arguments )
	}

	@autoLoading
	getSelectList() {
		return this.props.actions.getSelectList( ...arguments )
	}

	@autoLoading
	updatePublicList() {
		return this.props.actions.updatePublicList( ...arguments )
	}

	@autoLoading.bind(this, 'fileLoading')
	uploadFile() {
		return this.props.actions.uploadFile( ...arguments )
	}

	
	render() {
		return (
			<Spin spinning={this.props.pending}>
				<UpdateComp
					{...this.props}
					{...this.state}
					actions={{
						fetchInfoById: ::this.fetchInfoById,
						getSelectList: ::this.getSelectList,
						updatePublicList: ::this.updatePublicList,
						uploadFile: ::this.uploadFile
					}}
				/>
			</Spin>
		)
	}
}


 