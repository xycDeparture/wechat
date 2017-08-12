import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TextMessageComp from 'wechat/components/user_message/textMessage'
import { fetchUserMessageList, sendMessage } from 'wechat/actions'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'


@connect(
    ({ wechatTextMessage, application }) => ({ 
        pending: wechatTextMessage.get('pending'),
        content: wechatTextMessage.get('content'),
        params: wechatTextMessage.get('params'),
        select: wechatTextMessage.get('select'),
        backend_domain: application.getIn(['user', 'backend_domain'])
    }),
    dispatch => ({
        actions: bindActionCreators({ fetchUserMessageList, sendMessage }, dispatch)
    })
)

export default class TextMessageCompRoute extends React.Component {

    state = {
        loading: false,
        sendLoading: false
    }
    static storeName = 'wechatTextMessage'
    
    static fillStore(redux, props) {
        redux.dispatch(fetchUserMessageList({ ...props.location.query }))
    }

    @autoLoading.bind(this, 'loading')
    fetchUserMessageList() {
        return this.props.actions.fetchUserMessageList(...arguments)
    }

    @autoLoading.bind(this, 'sendLoading')
    sendMessage() {
        return this.props.actions.sendMessage(...arguments)
    }
    
    render() {
        return (
            <div>
                {this.props.children? this.props.children: 
                <Spin spinning={this.props.pending}>
                    <TextMessageComp
                        {...this.state}
                        {...this.props}
                        
                        actions={{
                            fetchUserMessageList: ::this.fetchUserMessageList,
                            sendMessage: ::this.sendMessage
                        }} 
                    ></TextMessageComp>
                </Spin>
                }
            </div>  
        )
    }
}