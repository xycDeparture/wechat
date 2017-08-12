import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_GROUP_LIST,
	UPDATE_WECHAT_GROUP_LIST,
	DELETE_WECHAT_GROUP_LIST,
	ADD_WECHAT_GROUP_LIST,
	FETCH_WECHAT_USERGROUP_LIST
} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	select: [],
	users: [],
	id:'',
	params: {
		page: 0,
		psize: 0,  
		count: 0
	},
	pending: true,
})

const actionHandlers = {
	[FETCH_WECHAT_GROUP_LIST]: (state, { response, select, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result.arrType))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[UPDATE_WECHAT_GROUP_LIST]: (state, {response, id}) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == id)
			if(index > -1) {
				response.result.id = id
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	[DELETE_WECHAT_GROUP_LIST]: (state, {response, id}) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[ADD_WECHAT_GROUP_LIST]: (state, {response}) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},
	['wechatGroup']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}

}


export default createReducer(initialState, actionHandlers)