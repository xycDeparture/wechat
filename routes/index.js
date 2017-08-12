import Entry from './entry'
import publicRoutes from './public'
import menuRoutes from './menu'
import replyRoutes from './reply'
import groupRoutes from './group'
import userRoutes from './user'
import sceneRoutes from './scene'
import positionRoutes from './position'
import qrcodeRoutes from './qrcode'
import mediaRoutes from './media'
import channelRoutes from './channel'
import pictureRoutes from './picture'
import sendGroupRoutes from './send_group'
import statisticalRoutes from './statistical'
import customMenuRoutes from './custom_menu'
import customMenuRuleRoutes from './custom_menu_rule'
import customServerRoutes from './customer'
import customManagementRoutes from './customer_management'
import customStatisticalRoutes from './customer_statistical'
import customSendMessageRoutes from './customer_send_message'
import userMessageRoutes from './user_message'
import logRoutes from './log'
import { hashHistory } from 'react-router'
const config = {
    root: {
        path: '/',
        rootPath: '/wechat/public/list',
        name: '微信',
        component: Entry,
        childRoutes: [
            publicRoutes,
            menuRoutes,
            replyRoutes,
            groupRoutes,
            userRoutes,
            channelRoutes,
            sceneRoutes,
            positionRoutes,
            qrcodeRoutes,
            mediaRoutes,
            pictureRoutes,
            sendGroupRoutes,
            ...statisticalRoutes,
            customMenuRoutes,
            customMenuRuleRoutes,
            customServerRoutes,
            customManagementRoutes,
            customStatisticalRoutes,
            customSendMessageRoutes,
            ...userMessageRoutes,
            logRoutes
        ]
    },
    redirect: [{
        path: '/index',
        ignore: true,
        onEnter: (_, replaceState) => {
            replaceState('/wechat/public/list')
        }
    }]
}

export default config
