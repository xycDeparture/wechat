import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_SENDGROUP_LIST, 
	FETCH_WECHAT_SENDGROUP_LIST_SELECT, 
	FETCH_WECHAT_SENDGROUP_MODAL_SELECT,
	FETCH_WECHAT_MASS_PREVIEW,
	SAVE_WECHAT_SENDGROUP_DATA,
	DELETE_WECHAT_SENDGROUP_DATA,
	UPDATE_WECHAT_SENDGROUP_DATA,
	UPDATE_WECHAT_SENDGROUP_AUDIT,
	UPDATE_WECHAT_MASS_STATUS
} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {
		name: '',
		msgtype: '',
		type: '',
		send_status: '',
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true,
	send_count: 0,
	//列表页的下拉数据
	contentSelect: {
		sendStatus: [], //发送状态
		sendType: [], //群发类型
		massType: [] //群发内容类型
	},

	modalSelect: {
		load: false,
		weixinGroup: [],
		sendType: [],
		massType: [],
		allImage: [],
		allVideo: [],
		allVoice: [],
		allTxt: [],
		virtualGroup: [],
		allUser: [],
		cardList: []
	},
	sendPreviewPerson: []
})

const actionHandlers = {
	[FETCH_WECHAT_SENDGROUP_LIST]: (state, { response: { list, count, page, send_count }, params }) => {
		return state.update('content', x => Immutable.fromJS(list))
					.set('send_count', Immutable.fromJS(send_count))
					.update('params', x => Immutable.fromJS({ ...x.toJS(), ...params, count, page }))
					.update('pending', x => false)
	},
	[FETCH_WECHAT_SENDGROUP_LIST_SELECT]: (state, { contentSelect }) => {
		return state.set('contentSelect', Immutable.fromJS(contentSelect))
	},
	[FETCH_WECHAT_SENDGROUP_MODAL_SELECT]: (state, { modalSelect }) => {
		modalSelect.load = true
		return state.set('modalSelect', Immutable.fromJS(modalSelect))
	},
    [FETCH_WECHAT_MASS_PREVIEW]: (state, { response }) => {
        return state.set('sendPreviewPerson', Immutable.fromJS(response.result))
    },
	[SAVE_WECHAT_SENDGROUP_DATA]: (state, { response }) => {
		// 发送状态
		let send_status_name = ''
		state.getIn(['contentSelect', 'sendStatus']).some(item => {
			if (item.get('id') == response.send_status) {
				send_status_name = item.get('name')
				return true
			}
		})
		response.send_status_name = send_status_name

		// 群发类型
		let type_name = ''
		state.getIn(['contentSelect', 'sendType']).some(item => {
			if (item.get('id') == response.type) {
				type_name = item.get('name')
				return true
			}
		})
		response.type_name = type_name

		// 群发内容类型
		let msgtype_name = ''
		state.getIn(['contentSelect', 'massType']).some(item => {
			if (item.get('id') == response.msgtype) {
				msgtype_name = item.get('name')
				return true
			}
		})
		response.msgtype_name = msgtype_name
		return state.update('content', x => x.unshift(Immutable.fromJS(response)))
					.updateIn(['params', 'count'], x => x + 1)
	},
	[DELETE_WECHAT_SENDGROUP_DATA]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},
	// TODO 有些数据无法更新，需要后台修改返回数据
	[UPDATE_WECHAT_SENDGROUP_DATA]: (state, { response, id }) => {
		let content = state.get('content')
		const index = content.findIndex(item => item.get('id') == id)
		content = content.update(index, x => {
			return Immutable.fromJS({
				...x.toJS(),
				...response
			})
		})
		return state.set('content', content)
	},
	[UPDATE_WECHAT_SENDGROUP_AUDIT]: (state, { id, auditType }) => {
		let content = state.get('content')
		const index = content.findIndex(item => item.get('id') == id)
		content = content.update(index, x => x = x.set('audit_type', auditType))
		return state.set('content', content)
	},
	// 修改发送状态为2
	[UPDATE_WECHAT_MASS_STATUS]: (state, { id }) => {
		return state.update('content', content => {

			const index = content.findIndex(item => item.get('id') == id)
			return content.update(index, item => item.set('send_status', 2))
		})
	},
	['wechatSendGroup']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)

