export const REQUEST_HISTORY = 'REQUEST_HISTORY';
export const RECEIVE_HISTORY = 'RECEIVE_HISTORY';
export const LOGOUT = 'LOGOUT';
export const RECEIVE_ME = 'RECEIVE_ME';

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

function receiveMe(me) {
    return {
        type: RECEIVE_ME,
        me
    };
}

function logoutMe(me) {
    return {
        type: LOGOUT
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


export function login(username, password) {
    return dispatch => {
        return fetch(`http://localhost:3001/api/login`,
            {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                mode: 'cors'
            })
            .then(req => req.json())
            .then(json => dispatch(receiveMe(json)));
    }
}

export function fetchMe() {
    return dispatch => {
        return fetch(`http://localhost:3001/api/me`,
            {
                method: "GET",
                credentials: 'include',
                mode: 'cors'
            })
            .then(req => req.json())
            .then(json => dispatch(receiveMe(json)));
    }
}


export function logout() {
    return dispatch => {
        return fetch(`http://localhost:3001/api/logout`,
            {
                credentials: 'include',
                mode: 'cors'
            })
            .then(req => req.text())
            .then(json => dispatch(logoutMe()));

    }
}
