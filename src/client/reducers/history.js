import * as HistoryActions from '../actions/history';

const fetchDefaultState = {
    isFetching: true
};

function userHistory(state = fetchDefaultState, action) {
    switch (action.type) {
        case HistoryActions.REQUEST_HISTORY:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case HistoryActions.RECEIVE_HISTORY:
            return Object.assign({}, state, {
                isFetching: false,
                ...action.history
            });
        default:
            return state;
    }
}

export default userHistory;