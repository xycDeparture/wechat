import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import AddMenuComp from 'wechat/components/menu/edit'

/**
 * 微信－菜单管理－添加主菜单
 */
export default class MenuEditRoute extends React.Component {
	static fillStore(redux, props) {

	}

	render() {
		return (
			<AddMenuComp></AddMenuComp>
		)
	}
}
