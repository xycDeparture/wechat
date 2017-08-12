import createReducer from 'Application/utils/create-reducer'
import {
	FETCH_WECHAT_QRCODE_SELECT,
	FETCH_WECHAT_QRCODE_LIST,
	SAVE_WECHAT_QRCODE,
	UPDATE_WECHAT_QRCODE,
	DELETE_WECHAT_QRCODE,
	ADD_WECHAT_SCENE,
	ADD_WECHAT_CHANNEL,
	ADD_WECHAT_GROUP,
	ADD_VIRTUAL_GROUP,
	ADD_WECHAT_POSITION
} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {
		page: 0,
		psize: 0,
		count: 0,
		name: ''
	},

	// 添加弹窗的各种下拉数据
	selectData: {
		weixinGroup: [],  // 分组类型
		virtualGroup: [], // 虚拟分组类型
		sceneList: [],    // 场景列表
		channelList: [],  // 渠道列表
		positionList: [], // 位置列表
		qrcodeType: []   // 二维码类型
	}
})

const actionHandlers = {
	[FETCH_WECHAT_QRCODE_SELECT]: (state, { selectData }) => {
		return state.set('selectData', Immutable.fromJS(selectData))
	},

	[FETCH_WECHAT_QRCODE_LIST]: (state, { response: { count, page, list }, psize, name }) => {

		return state.update('content', x => Immutable.fromJS(list))
					.update('pending', x => false)
					.update('params', x => Immutable.fromJS({
						page,
						count,
						psize,
						name
					}))

	},
	
	[ADD_WECHAT_SCENE]: (state, { response }) => {
        return state.updateIn(['selectData', 'sceneList'], x => x.unshift(Immutable.fromJS(response)))
    },
    
    [ADD_WECHAT_CHANNEL]: (state, { response }) => {
        return state.updateIn(['selectData', 'channelList'], x => x.unshift(Immutable.fromJS(response)))
    },
    
    [ADD_WECHAT_GROUP]: (state, { response }) => {
        return state.updateIn(['selectData', 'weixinGroup'], x => x.unshift(Immutable.fromJS(response)))
    },
    
    [ADD_VIRTUAL_GROUP]: (state, { response }) => {
        return state.updateIn(['selectData', 'virtualGroup'], x => x.unshift(Immutable.fromJS(response)))
    },
    
    [ADD_WECHAT_POSITION]: (state, { response }) => {
        return state.updateIn(['selectData', 'positionList'], x => x.unshift(Immutable.fromJS(response)))
    },
    
	[SAVE_WECHAT_QRCODE]: (state, { response }) => {
		let type_name = ''

		const selectData = state.get('selectData').toJS()

		selectData.positionList.some(item => {
			if (item.id == response.position) {
				response.position_name = item.name
				return true
			}
		})

		selectData.sceneList.some(item => {
			if (item.id == response.scene) {
				response.scene_name = item.name
				return true
			}
		})

		selectData.channelList.some(item => {
			if (item.id == response.channel) {
				response.channel_name = item.name
				return true
			}
		})

		return state.update('content', x => x.unshift(Immutable.fromJS(response)))
					.updateIn(['params', 'count'], x => x + 1)
	},
	
	[UPDATE_WECHAT_QRCODE]: (state, { response }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.get('id') == response.id)
			return x.update(index, item => {
				return Immutable.fromJS({
					...item.toJS(),
					...response
				})
			})
		})
	},
	
	[DELETE_WECHAT_QRCODE]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	}
}

export default createReducer(initialState, actionHandlers)
