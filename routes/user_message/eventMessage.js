import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import EventMessageComp from 'wechat/components/user_message/eventMessage'
import { fetchEventMessageList, sendEventMessage } from 'wechat/actions'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

@connect(
    ({ wechatEventMessage, application }) => ({ 
        pending: wechatEventMessage.get('pending'),
        content: wechatEventMessage.get('content'),
        params: wechatEventMessage.get('params'),
        select: wechatEventMessage.get('select'),
        backend_domain: application.getIn(['user', 'backend_domain'])
    }),
    dispatch => ({
        actions: bindActionCreators({ fetchEventMessageList, sendEventMessage }, dispatch)
    })
)

export default class EventMessageCompRoute extends React.Component {

    state = {
        loading: false,
        sendLoading: false
    }
    static storeName = 'wechatEventMessage'
    
    static fillStore(redux, props) {
        redux.dispatch(fetchEventMessageList({ ...props.location.query }))
    }

    @autoLoading.bind(this, 'loading')
    fetchEventMessageList() {
        return this.props.actions.fetchEventMessageList(...arguments)
    }
    
    @autoLoading.bind(this, 'sendLoading')
    sendEventMessage() {
        return this.props.actions.sendEventMessage(...arguments)
    }

    render() {
        return (
            <div>
                {this.props.children? this.props.children: 
                <Spin spinning={this.props.pending}>
                    <EventMessageComp
                        {...this.state}
                        {...this.props}
                        
                        actions={{
                            fetchEventMessageList: ::this.fetchEventMessageList,
                            sendEventMessage: ::this.sendEventMessage
                        }} 
                    ></EventMessageComp>
                </Spin>
                }
            </div>  
        )
    }
}