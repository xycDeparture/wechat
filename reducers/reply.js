import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_REPLY_LIST, 
	ADD_WECHAT_REPLY_LIST, 
	DELETE_WECHAT_REPLY_LIST, 
	UPDATE_WECHAT_REPLY_LIST,
	FETCH_WECHAT_REPLY_BYID
} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	select: [],
	firstLoad: false,
	editSelect: {
		signType:[],
		signName:[],
		evenType:[],
		replyType:[],
		sceneList:[],
		allImage:[],
        mstchingType: [],
		weixinGroup: []
	},
	info:{},
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true,
})

const actionHandlers = {
	[FETCH_WECHAT_REPLY_LIST]: (state, { response, select, editSelect, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result.evenType))
			.update('editSelect', x => Immutable.fromJS(editSelect.result))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[DELETE_WECHAT_REPLY_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[ADD_WECHAT_REPLY_LIST]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[UPDATE_WECHAT_REPLY_LIST]: (state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == id)
			if(index > -1) {
				response.result.id = id
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	[FETCH_WECHAT_REPLY_BYID]: (state, { response }) => {
		return state.update('info', x => Immutable.fromJS(response.result))
	},

	['wechatReply']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}


}


export default createReducer(initialState, actionHandlers)