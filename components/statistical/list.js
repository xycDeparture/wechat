import React, { PropTypes } from 'react'

import { Link } from "react-router"

import Button from 'antd/lib/button'

import Icon from 'antd/lib/icon'




export default class StatisticalComp extends React.Component {
	constructor(props, context) {
		super(props, context)
	}

	renderRouteNav() {
		return (
			<div className="toolbar">
				<Link to="/wechat/statistical/user/list"><Button  type="primary"><Icon type="eye"/>用户分析</Button></Link><span> </span>
				<Link to="/wechat/statistical/picture/list"><Button  type="primary"><Icon type="eye"/>图文分析</Button></Link><span> </span>
				<Link to="/wechat/statistical/message/list"><Button  type="primary"><Icon type="eye"/>消息分析</Button></Link><span> </span>
				<Link to="/wechat/statistical/interface/list"><Button  type="primary"><Icon type="eye"/>接口分析</Button></Link><span> </span>
			</div>
		)
	}

	render() {
		return (
			<div>
				{this.renderRouteNav()}
				{this.props.children}
			</div>
		)
	}
}