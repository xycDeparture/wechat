import createReducer from 'Application/utils/create-reducer'
import { FETCH_WECHAT_ERRORLOG_LIST } from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	pending: true,
	params: {
		page: 0,
		psize: 0,
		count: 0
	}
})

const actionHandlers = {
	[FETCH_WECHAT_ERRORLOG_LIST]: (state, { response, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	['wechatErrorLog']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)