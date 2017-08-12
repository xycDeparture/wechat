import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_PICTURE_LIST, 
	SAVE_WECHAT_PICTURE,
	FETCH_WECHAT_PICTURE_BYID,
	DELETE_WECHAT_PICTURE_MATERIAL,
	UPDATE_WECHAT_MEDIA_ID,
	UPDATE_WECHAT_PICTURE
} from 'wechat/constants'
import Immutable from 'immutable'


const initialState = Immutable.fromJS({
	content: [],
	params: {
		count: 0,
		page: 0,
		pszie: 0
	},

	editData: {}
})

const actionHandlers = {
	[FETCH_WECHAT_PICTURE_LIST]: (state, { response: { list }, params }) => {
		
		return state.set('content', Immutable.fromJS(list))
					.set('params', Immutable.fromJS(params))
					.set('pending', false)
	},
	[SAVE_WECHAT_PICTURE]: (state, { response: { id, result } }) => {
		console.log(id, result)
		return state.update('content', x => x = x.unshift(Immutable.fromJS(result)))
	},
	[UPDATE_WECHAT_PICTURE]: (state, { response }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.get('id') == response.result.id)
			if(index > -1){
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},
	[FETCH_WECHAT_PICTURE_BYID]: (state, { response }) => {
		return state.set('editData', Immutable.fromJS(response) )
	},
	[DELETE_WECHAT_PICTURE_MATERIAL]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
	},
	[UPDATE_WECHAT_MEDIA_ID]: (state, { id, mediaId }) => {
		console.log(mediaId)
		return state.update('content', x => x.map(item => {
			if (item.get('id') == id && mediaId) {
				item = item.set('media_id', mediaId)
			}
			return item
		}))
	},
	['wechatPicture']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)