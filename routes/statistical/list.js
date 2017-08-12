import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import StatisticalComp from 'wechat/components/statistical/list'

export default class UserCompRoute extends React.Component {
	render() {
		return (
			<StatisticalComp>
				{this.props.children}
			</StatisticalComp>	
		)
	}
}