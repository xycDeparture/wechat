import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_MENU_LIST, 
	UPDATE_MENU_ITEM_STATUS,
	ADD_WECHAT_MENU_LIST,
	DELETE_WECHAT_MENU_LIST,
	UPDATE_WECHAT_MENU_LIST,
	CHECK_WECHAT_MENU_LIST

} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	select: {
		menuType:[],
		allTxt:[],
		allMaterial:[]
	},
	count: 0,
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_WECHAT_MENU_LIST]: (state, { response, select, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[ADD_WECHAT_MENU_LIST]: (state, {response: { result } }) => {
		return state.update('content', x => {
			if(result.parent_id == 0) {
				result.children = []
				return x.push(Immutable.fromJS(result))
			}else{
				for(let [key, value] of x.entries()){
					if(value.get('id') == result.parent_id){
						const children = value.get('children').push(Immutable.fromJS(result))
						return x.update(key, k =>  k.set('children', children))
					}
				}
			}
		})
		.updateIn(['params', 'count'], x => result.parent_id == 0? x + 1: x)
	},

	[UPDATE_WECHAT_MENU_LIST]: (state, {response: { result }, id }) => {
		
		return state.update('content', x => {
			result.id = id
			if(result.parent_id == 0) {
				var index1 = x.findIndex(item => item.get('id') == id)
				if(index1 > -1) {
					// result.children = resu
					return x.update(index1, x => Immutable.fromJS(result))
				}
			}else{
				for(let [key, value] of x.entries()){
					if(value.get('id') == result.parent_id){
						var index2 = value.get('children').findIndex(item => item.get('id') == id)
						if(index2 > -1) {
							const children = value.get('children').update(index2, x => Immutable.fromJS(result))
							return x.update(key, k =>  k.set('children', children))
						}
					}
				}
			}
		})
	},

	[DELETE_WECHAT_MENU_LIST]: (state, {response: { result }, id }) => {
		var isParent = false
		return state.update('content', x => {
			for(let [key, value] of x.entries()) {
				if(value.get('id') == id) {
					isParent = true
					return x.filter(item => item.get('id') != id)
				}else{
					for(let [key1, value1] of value.get('children').entries()){
						if(value1.get('id') == id) {
							let children = value.get('children').delete(key1)
							return x.update(key, k => k.set('children', children))
						}
					}
				}
			}
		})
		.updateIn(['params', 'count'], x => isParent? x - 1: x)
	},

	[CHECK_WECHAT_MENU_LIST]: (state, {response}) => {
		return state
	},

	['wechatMenu']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)