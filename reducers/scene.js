import createReducer from 'Application/utils/create-reducer'
import { FETCH_WECHAT_SCENE_LIST, SAVE_WECHAT_SCENE, UPDATE_WECHAT_SCENE, DELETE_WECHAT_SCENE } from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {
		page: 0,
		psize: 0,
		count: 0,
		name: ''
	}
})

const actionHandlers = {
	[FETCH_WECHAT_SCENE_LIST]: (state, { response: { count, page, list }, psize, name }) => {
		
		return state.update('content', x => Immutable.fromJS(list))
					.update('pending', x => false)
					.update('params', x => Immutable.fromJS({
						page,
						count,
						psize,
						name
					}))
					
	},
	[SAVE_WECHAT_SCENE]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response)))
					.updateIn(['params', 'count'], x => x + 1)
	},
	[UPDATE_WECHAT_SCENE]: (state, { response: { id, name, remark } }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.get('id') == id)
			return x.update(index, item => {
				item = item.set('name', name)
				item = item.set('remark', remark)
				return item
			})
		})
	},
	[DELETE_WECHAT_SCENE]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	}
}


export default createReducer(initialState, actionHandlers)