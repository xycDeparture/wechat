import list from './list'
import edit from './edit'
import update from './update'

export default {
    path: '/wechat/public/list',
    name: '公众号',
    component: list,
    childRoutes: [{
        path: '/wechat/public/edit',
        name: '添加',
        component: edit
    }, {
        path: '/wechat/public/update',
        name: '详情',
        component: update
    }]
}
/*export default {
    path: '/wechat/public/list',
    name: '公众号',
    getComponent(nextState, cb) {
        require.ensure([], require => {
            const comp = require('./list').default
            cb(null, comp)
            this.routeWillReceivedComponent(comp)
        }, 'wechatPublicList')
    },
    childRoutes: [{
        path: '/wechat/public/edit',
        name: '添加',
        getComponent(nextState, cb) {
            require.ensure([], require => {
                const comp = require('./edit').default
                cb(null, comp)
            }, 'wechatPublicEdit')
        }
    }, {
        path: '/wechat/public/update',
        name: '详情',
        getComponent(nextState, cb) {
            require.ensure([], require => {
                const comp = require('./update').default
                cb(null, comp)
            }, 'wechatPublicUpdate')
        }
    }]
}*/