import textMessage from './textMessage'
import eventMessage from './eventMessage'
import reply from './reply'
import eventMessageReply from './eventMessageReply'

export default [{
    path: '/wechat/textMessage/list',
    name: '文本消息',
    component: textMessage,
    childRoutes: [{
        path: '/wechat/textMessage/reply',
        name: '回复',
        component: reply
    }]
}, {
    path: '/wechat/eventMessage/list',
    name: '事件消息',
    component: eventMessage,
    childRoutes: [{
        path: '/wechat/eventMessage/reply',
        name: '回复',
        component: eventMessageReply
    }]
}]
