import list from './list'
import check from './check'

export default {
    path: '/wechat/user/list(/:page)(/:psize)',
    name: '微信用户',
    component: list,
    childRoutes: [{
        path: '/wechat/user/check',
        name: '查看单个用户',
        component: check
    }]
}
