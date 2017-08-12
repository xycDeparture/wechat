import list from './list'
import edit from './edit'

export default {
    path: '/wechat/picture-material/list',
    name: '图文素材',
    component: list,
    childRoutes: [{
        path: '/wechat/picture-material/edit',
        name: '编辑',
        component: edit
    }]
}
