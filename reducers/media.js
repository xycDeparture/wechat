import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_MEDIA_LIST,
	FETCH_WECHAT_MEDIA_SELECT, 
	DELETE_WECHAT_MEDIA, 
	FETCH_WECHAT_MEDIA_BYID,
	UPDATE_WECHAT_MEDIA,
	SAVE_WECHAT_MEDIA 
} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {},
	validateType: [],
	mediaType: [],
	selectDataLoad: false,

	// 编辑数据
	editData: {}
})

const actionHandlers = {
	[FETCH_WECHAT_MEDIA_LIST]: (state, { response: { result: { list } }, params }) => {
		return state.set('content', Immutable.fromJS(list))
					.set('params', Immutable.fromJS(params))
					.set('pending', false)
	},
	[FETCH_WECHAT_MEDIA_SELECT]: (state, { response: { validateType, mediaType } }) => {
		return state.set('validateType', Immutable.fromJS(validateType))
					.set('mediaType', Immutable.fromJS(mediaType))
					.set('selectDataLoad', true)
	},
	[DELETE_WECHAT_MEDIA]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
	},
	[FETCH_WECHAT_MEDIA_BYID]: (state, { response }) => {
		return state.set('editData', Immutable.fromJS(response))
	},
	[UPDATE_WECHAT_MEDIA]: (state, { id, response }) => {
		return state.update('content', x => {
			x = x.map(item => {
				if (item.get('id') == id) {
					item = item.set('name', response.name)
				}
				return item
			})
			return x
		})
	},
	[SAVE_WECHAT_MEDIA]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response)))
	},

	['wechatMedia']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)