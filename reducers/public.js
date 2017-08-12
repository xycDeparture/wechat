import createReducer from 'Application/utils/create-reducer'
import { 
		FETCH_WECHAT_PUBLIC_LIST, 
		UPDATE_WECHAT_PUBLIC_LIST, 
		FETCH_WECHAT_PUBLIC_SELECT ,
		UPDATE_ITEM_PRINT,
		ADD_WECHAT_PUBLIC_LIST,
		DELETE_WECHAT_PUBLIC_LIST,
		FETCH_INFO_BY_ID
	 } from 'wechat/constants'
import Immutable from 'immutable'


const initialState = Immutable.fromJS({
	content: [],
	pending: true,
	select: {
		authState: [],
		customerService: [],
		payModel: [],
		photoPrintType: [],
		photoWall: [],
		photoWallCheck: [],
        photoSceneList: [],
		serviceType: [],
		verifyType: []
	},
	info:{
		nick_name: '',
		original_id: '',
		appId: '',
		appSecret: '',
		wechat_account: '',
		mch_id:'',
		pay_key: '',
		auth_status:'',
		service_type_info:'',
		verify_type_info: '',
		pay_mode: '',
		photo_wall: '',
		photo_print: '',
		customer_service: ''
	},
	count: 0,
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
})

const actionHandlers = {
	// 查询公众号列表
	[FETCH_WECHAT_PUBLIC_LIST]: (state, { response, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
					.update('params', x => Immutable.fromJS(params))
					.update('pending', x => false)
	},

	// 获取下拉数据
	[FETCH_WECHAT_PUBLIC_SELECT]: (state, { response }) => {
		return state.update('select', x => Immutable.fromJS(response.result))
					.update('pending', x => false)
	},

	// 添加公众号
	[ADD_WECHAT_PUBLIC_LIST]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	// 修改公众号
	[UPDATE_WECHAT_PUBLIC_LIST]: (state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == id)
			if(index > -1) {
				response.result.id = id
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
		.update('info', x => Immutable.fromJS(response.result))
	},

	//公众号详情
	[FETCH_INFO_BY_ID]: (state, {response}) => {
		return state.update('info', x => Immutable.fromJS(response.result))
	},

	//删除公众号
	[DELETE_WECHAT_PUBLIC_LIST]: (state, {response,  id}) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	// 修改照片打印选项
	[UPDATE_ITEM_PRINT]: (state, { response }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.key === response.key)
			return x.update(index, item => response)
		})
	},

	['wechatPublic']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)