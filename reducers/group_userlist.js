import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_USERGROUP_LIST
} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	users: [],
	params: {
		page: 0,
		psize: 0,  
		count: 0
	},
	gid: '',
	select: {
		weixinGroup: [],
		virtualGroup: []
	},
	pending: true,
})

const actionHandlers = {

	[FETCH_WECHAT_USERGROUP_LIST]: (state, { response, select, params, gid }) => {
		return state.update('users', x => Immutable.fromJS(response.result.list))
					.update('gid', x => gid)
					.update('select', x => Immutable.fromJS(select.result))
					.update('params', x => Immutable.fromJS(params))
					.update('pending', x => false)
	},
	['wechatGroupUser']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)