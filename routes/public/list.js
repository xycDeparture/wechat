import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ListComp from 'wechat/components/public/list'
import { fetchPublicList, updatePublicList, updateItemPrint, delPublicItem } from 'wechat/actions'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－公众号－列表页路由
 */

@connect(
	({ wechatPublic, application }) => ({ 
		pending: wechatPublic.get('pending'),
		content: wechatPublic.get('content'),
		params: wechatPublic.get('params'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchPublicList, updatePublicList, updateItemPrint, delPublicItem }, dispatch)
	})
)

export default class ListCompRoute extends React.Component {

	state = {
		loading: false,
		updateLoading: false,
	}

	static storeName = 'wechatPublic'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchPublicList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchPublicList() {
		return this.props.actions.fetchPublicList( ...arguments )
	}

	@autoLoading.bind(this, 'updateLoading')
	updatePublicList() {
		return this.props.actions.updatePublicList( ...arguments )
	}

	@autoLoading
	updateItemPrint() {
		return this.props.actions.updateItemPrint( ...arguments )
	}

	@autoLoading
	delPublicItem() {
		return this.props.actions.delPublicItem( ...arguments )
	}


	render () {
		return (
			<Spin spinning={this.props.pending}>
				{
					this.props.children ?
						this.props.children :
						<ListComp 
							{...this.props}
							{...this.state}
							actions={{
								updateItemPrint: ::this.updateItemPrint,
								fetchPublicList: ::this.fetchPublicList,
								updatePublicList: ::this.updatePublicList,
								delPublicItem: ::this.delPublicItem
							}}
						/>
				}
			</Spin>
		)
	}

}
