import { combineReducers } from 'redux';

import * as Actions from '../actions';

const userDefaultState = null;
const historyDefaultState = {
    isFetching: true
};

function user(state = userDefaultState, action) {
    switch (action.type) {
        case Actions.RECEIVE_ME:
            return Object.assign({}, action.me);
        case Actions.LOGOUT:
            return null;
        default:
            return state;
    }
}
function userHistory(state = historyDefaultState, action) {
    switch (action.type) {
        case Actions.REQUEST_HISTORY:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case Actions.RECEIVE_HISTORY:
            return Object.assign({}, state, {
                isFetching: false,
                ...action.history
            });
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    user,
    userHistory
});

export default rootReducer;