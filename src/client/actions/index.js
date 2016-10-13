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
    return dispatch => {
        dispatch(requestHistory());
        return fetch(`http://localhost:3001/api/history?hr=true`,
            {
                credentials: 'include',
                mode: 'cors'
            })
            .then(req => req.json())
            .then(json => dispatch(receiveHistory(json)));
    }
}
