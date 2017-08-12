import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_CUSTOMMENUPKG_LIST,
	ADD_WECHAT_CUSTOMMENUPKG_LIST,
	DELETE_WECHAT_CUSTOMMENUPKG_LIST,
	UPDATE_WECHAT_CUSTOMMENUPKG_LIST

} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	select: {
		allMaterial:[],
		allTxt:[],
		menuType: []
	},
	pending: true
})

const actionHandlers = {
	[FETCH_WECHAT_CUSTOMMENUPKG_LIST]: (state, { response, select }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result))
			.update('pending', x => false)
	},

	[ADD_WECHAT_CUSTOMMENUPKG_LIST]: (state, { response: { result } }) => {
		return state
	},

	[DELETE_WECHAT_CUSTOMMENUPKG_LIST]: (state, { response: { result }, id }) => {
		return state
	},

	[UPDATE_WECHAT_CUSTOMMENUPKG_LIST]: (state, { response: { result }, id }) => {
		return state
	},

	['wechatCustomMenuPkg']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)