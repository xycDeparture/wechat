import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Spin from 'antd/lib/spin'

import QRCodeComp from 'wechat/components/qrcode/list'
import { 
    fetchQRCodeSelect,
    fetchQRCodeList,
    editQRCode,
    addWechatScene,
    addChannel,
    addWechatGroup,
    addVirtualGroup,
    addPosition
} from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'


/**
 * 微信－场景－列表页路由
 */

@connect(
	({ wechatQRCode }) => ({ 
		selectData: wechatQRCode.get('selectData'),
		content: wechatQRCode.get('content'),
		params: wechatQRCode.get('params'),
		pending: wechatQRCode.get('pending'),
		error: wechatQRCode.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({
		    fetchQRCodeSelect,
		    fetchQRCodeList,
		    editQRCode,
		    addWechatScene,
		    addChannel,
		    addWechatGroup,
		    addVirtualGroup,
		    addPosition
		}, dispatch)
	})
)

export default class QRCodeRoute extends React.Component {

	state = {
		loading: false,
		submitLoading: false,
		editLoading: false,
		addSceneLoading: false,
		addChannelLoading: false,
		addWechatGroupLoading: false,
		addVirtualGroupLoading: false,
		addPositionLoading: false
	}

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchQRCodeList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchQRCodeList() {
		return this.props.actions.fetchQRCodeList(...arguments)
	}

	@autoLoading.bind(this, 'submitLoading')
	editQRCode() {
		return this.props.actions.editQRCode(...arguments)
	}

	@autoLoading.bind(this, 'editLoading')
	fetchQRCodeSelect() {
		return this.props.actions.fetchQRCodeSelect(...arguments)
	}
	
    @autoLoading.bind(this, 'addSceneLoading')
    addWechatScene() {
        return this.props.actions.addWechatScene(...arguments)
    }
    
    @autoLoading.bind(this, 'addChannelLoading')
    addChannel() {
        return this.props.actions.addChannel(...arguments)
    }
    
    @autoLoading.bind(this, 'addWechatGroupLoading')
    addWechatGroup() {
        return this.props.actions.addWechatGroup(...arguments)
    }
    
    @autoLoading.bind(this, 'addVirtualGroupLoading')
    addVirtualGroup() {
        return this.props.actions.addVirtualGroup(...arguments)
    }
    
    @autoLoading.bind(this, 'addPositionLoading')
    addPosition() {
        return this.props.actions.addPosition(...arguments)
    }

	render() {
		return (
			<Spin spinning={this.props.pending}>
				<QRCodeComp
					{...this.props}
					{...this.state}
					actions={{
						editQRCode: ::this.editQRCode,
						fetchQRCodeList: ::this.fetchQRCodeList,
						fetchQRCodeSelect: ::this.fetchQRCodeSelect,
						addWechatScene: ::this.addWechatScene,
						addChannel: ::this.addChannel,
						addWechatGroup: ::this.addWechatGroup,
						addVirtualGroup: ::this.addVirtualGroup,
						addPosition: ::this.addPosition
					}} 
				/>
			</Spin>
		)
	}
}