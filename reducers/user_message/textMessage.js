import createReducer from 'Application/utils/create-reducer'
import { FETCH_USERMESSAGE_LIST, FETCH_WECHAT_REPLY_DATA, FETCH_WECHAT_REPLY_SELECT } from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
    content: [],
    select: [],
    params: {
        page: 0,
        psize: 0,
        count: 0
    },
    pending: true,
    
    replyData: {},
    //回复 （消息类型下拉列表）
    replySelectData: []
})

const actionHandlers = {
    [FETCH_USERMESSAGE_LIST]: (state, { response, select, params }) => {
        return state.update('content', x => Immutable.fromJS(response.result.list))
            .update('select', x => Immutable.fromJS(select.result.messageType))
            .update('params', x => Immutable.fromJS(params))
            .update('pending', x => false)
    },
    
    [FETCH_WECHAT_REPLY_DATA]: (state, { response }) => {
        return state.set('replyData', Immutable.fromJS(response.result))
    },
    
    [FETCH_WECHAT_REPLY_SELECT]: (state, { response }) => {
        return state.set('replySelectData', Immutable.fromJS(response.result.reply_type))
    },
    
    ['wechatTextMessage']:  (state, { error }) => {
        return state.set('pending', false)
                    .set('error', error)
    }
}


export default createReducer(initialState, actionHandlers)