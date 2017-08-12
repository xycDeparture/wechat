import createReducer from 'Application/utils/create-reducer'
import { FETCH_WECHAT_USER_LIST, FETCH_WECHAT_SINGER_USER } from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	select: {
		weixinGroup: [],
		virtualGroup: []
	},
	option: {
		sexType:[],
		weixinGroup:[],
		virtualGroup: [],
		channelList: []
	},
	pending: true,
	user: {
		virtual_groupid: [],
		channelid: []
	},
	id: '',
	params: {
		page: 0,
		psize: 0,
		count: 0
	}
})

const actionHandlers = {
	[FETCH_WECHAT_USER_LIST]: (state, { response, select, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('select', x => Immutable.fromJS(select.result))
			.update('pending', x => false)
	},

	[FETCH_WECHAT_SINGER_USER]: (state, { response, option, id }) => {
		return state.update('user', x => Immutable.fromJS(response.result))
					.update('id', x => id)
					.update('option', x => Immutable.fromJS(option.result))
	},
	['wechatUser']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)