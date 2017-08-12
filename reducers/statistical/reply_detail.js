import createReducer from 'Application/utils/create-reducer'
import { FETCH_WECHAT_STATISTICAL_MESSAGE_DETAIL } from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	select: [],
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true,
})

const actionHandlers = {
	[FETCH_WECHAT_STATISTICAL_MESSAGE_DETAIL]: (state, { response, select, params }) => {
		
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result.messageType))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},
	['wechatAnalysisMessageDetail']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)