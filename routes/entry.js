import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import SideNav from 'Application/components/nav/sideNav'
import BreadNav from 'Application/components/nav/breadNav'

/**
 * 左侧二级路由
 */

export default class WechatRoute extends React.Component {
    static propTypes = {
        appRoutes: PropTypes.any
    }

    render () {
        if(this.props.appRoutes.size === 0) {
            return null
        }

        const childRoutes = this.props.appRoutes.filter(item => item.name === '微信').get(0)
        
        return (
            <div>
                <SideNav 
                    route={childRoutes} 
                />
                <div className="breadNav">
                    <BreadNav/>
                </div>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        )
    }

}
