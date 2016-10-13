import { combineReducers } from 'redux';

import {
    REQUEST_HISTORY, RECEIVE_HISTORY
} from '../actions';


const defaultState = {
    isFetching: true
};

function userHistory(state = defaultState, action) {
    switch (action.type) {
        case REQUEST_HISTORY:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case RECEIVE_HISTORY:
            return Object.assign({}, state, {
                isFetching: false,
                ...action.history
            });
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    userHistory
});

export default rootReducer;