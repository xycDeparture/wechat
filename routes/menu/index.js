import list from './list'
import edit from './edit'

export default {
    path: '/wechat/menu/list(/:page)(/:psize)',
    name: '菜单管理',
    component: list,
    childRoutes: [{
        path: '/wechat/menu/edit',
        name: '添加主菜单',
        component: edit
    }]
}
