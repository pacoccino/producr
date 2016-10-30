import ApiService from '../services/ApiService';

export const REQUEST_HISTORY = 'REQUEST_HISTORY';
export const RECEIVE_HISTORY = 'RECEIVE_HISTORY';

function requestHistory() {
    return {
        type: REQUEST_HISTORY,
    };
}

function receiveHistory(history) {
    return {
        type: RECEIVE_HISTORY,
        history,
        receivedAt: Date.now()
    };
}

export function fetchHistory() {
    return (dispatch) => {
        dispatch(requestHistory());
        return ApiService.getHistory()
            .then(json => dispatch(receiveHistory(json)));
    }
}


export function updateHistory() {
    return (dispatch) => {
        dispatch(requestHistory());
        return ApiService.updateHistory()
            .then(json => dispatch(fetchHistory()));
    }
}