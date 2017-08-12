import list from './list'
import edit from './edit'
import add from './add'
import check from './check'

export default {
    path: '/wechat/reply/list',
    name: '回复管理',
    component: list,
    childRoutes: [{
        path: '/wechat/reply/edit',
        name: '编辑',
        component: edit
    },{
        path: '/wechat/reply/add',
        name: '添加',
        component: add
    },{
        path: '/wechat/reply/check',
        name: '查看',
        component: check
    }]
}
