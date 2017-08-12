import list from './list'
import edit from './edit'

export default {
    path: '/wechat/media-material/list(/:page)(/:psize)',
    name: '多媒体素材',
    component: list,
    childRoutes: [{
        path: '/wechat/media/edit',
        name: '编辑',
        component: edit
    }]
}
