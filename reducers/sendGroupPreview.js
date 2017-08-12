import createReducer from 'Application/utils/create-reducer'
import { 
    FETCH_SENDGROUP_PREVIEW,
    DELETE_SENDGROUP_PREVIEW
} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
    content: []
})

const actionHandlers = {
    [FETCH_SENDGROUP_PREVIEW]: (state, { allUser }) => {
        return state.set('content', Immutable.fromJS(allUser))
    },
    [DELETE_SENDGROUP_PREVIEW]: state => state.set('content', Immutable.fromJS([]))
}

export default createReducer(initialState, actionHandlers)