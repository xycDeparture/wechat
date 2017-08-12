import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MenuListComp from 'wechat/components/menu/list'
import {
	fetchMenuList,
	addMenuList,
	updateMenuList,
	delMenuList,
	checkMenuList,
	updateItemStatus,
	updateMenuStauts,
	syncPrimaryMenu,
	updateMenuSort
} from 'wechat/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'



/**
 * 微信－菜单管理－列表页路由
 */

@connect(
	({ wechatMenu }) => ({ 
		content: wechatMenu.get('content'),
		select: wechatMenu.get('select'),
		params: wechatMenu.get('params'),
		pending:  wechatMenu.get('pending'),
		error: wechatMenu.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchMenuList, addMenuList, updateMenuList, delMenuList, checkMenuList, updateItemStatus, updateMenuStauts, updateMenuSort, syncPrimaryMenu }, dispatch)
	})
)
export default class ListCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
		checkLoading: false
	}

	static storeName = 'wechatMenu'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchMenuList({ ...props.location.query }))
		])
		
	}

	@autoLoading.bind(this, 'loading')
	fetchMenuList() {
		return this.props.actions.fetchMenuList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addMenuList() {
		return this.props.actions.addMenuList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateMenuList() {
		return this.props.actions.updateMenuList(...arguments)
	}

	@autoLoading.bind(this, 'checkLoading')
	checkMenuList() {
		return this.props.actions.checkMenuList(...arguments)
	}

	@autoLoading
	delMenuList() {
		return this.props.actions.delMenuList(...arguments)
	}

	@autoLoading
	updateMenuStauts() {
		return this.props.actions.updateMenuStauts(...arguments)
	}

	@autoLoading
	syncPrimaryMenu() {
		return this.props.actions.syncPrimaryMenu( ...arguments )
	}

	@autoLoading.bind(this, 'loading')
	updateMenuSort() {
		return this.props.actions.updateMenuSort(...arguments)
	}

	render () {
		return (
			<Spin spinning={this.props.pending}>
			{
				this.props.children ? 
					this.props.children : 
					<MenuListComp 
						{...this.props}
						{...this.state}
						actions={{
							fetchMenuList: ::this.fetchMenuList,
							addMenuList: ::this.addMenuList,
							updateMenuList: ::this.updateMenuList,
							checkMenuList: ::this.checkMenuList,
							delMenuList: ::this.delMenuList,
							updateMenuStauts: ::this.updateMenuStauts,
							syncPrimaryMenu: ::this.syncPrimaryMenu,
							updateMenuSort: ::this.updateMenuSort
						}}
					/>
			}
			</Spin>
		)
	}

}
