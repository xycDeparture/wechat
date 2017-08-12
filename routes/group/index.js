import list from './list'
import users from './users'

export default {
    path: '/wechat/group/list',
    name: '微信分组',
    component: list,
    childRoutes: [{
        path: '/wechat/group/users',
        name: '查看微信用户',
        component: users
    }]
}
