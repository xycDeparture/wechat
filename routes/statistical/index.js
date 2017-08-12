import user_analysis from './user_analysis'
import picture_analysis from './picture_analysis'
import picture_detail from './picture_detail'
import message_analysis from './message/message_analysis'
import reply_detail from './message/reply_detail'
import interface_analysis from './interface_analysis'

export default [{
    path: '/wechat/statistical/user/list',
    name: '用户分析',
    component: user_analysis,
}, {
    path: '/wechat/statistical/picture/list',
    name: '图文分析',
    component: picture_analysis,
    childRoutes: [{
        path: '/wechat/statistical/picture/detail',
        name: '查看图文分析明细',
        component: picture_detail
    }]
}, {
    path: '/wechat/statistical/message/list',
    name: '消息分析',
    component: message_analysis,
    childRoutes: [{
        path: '/wechat/statistical/message/detail',
        name: '查看用户回复消息详情',
        component: reply_detail
    }]
}, {
    path: '/wechat/statistical/interface/list',
    name: '接口分析',
    component: interface_analysis
}]
