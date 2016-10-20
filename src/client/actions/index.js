import AuthService from '../services/AuthService';
import ApiService from '../services/ApiService';

export const REQUEST_HISTORY = 'REQUEST_HISTORY';
export const RECEIVE_HISTORY = 'RECEIVE_HISTORY';
export const AUTH_NULL = 'AUTH_NULL';
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_ERROR = 'AUTH_ERROR';


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
    return (dispatch, getState) => {
        dispatch(requestHistory());
        return ApiService.getHistory(getState().auth.jwt)
            .then(json => dispatch(receiveHistory(json)));
    }
}


export function updateHistory() {
    return (dispatch, getState) => {
        dispatch(requestHistory());
        return ApiService.updateHistory(getState().auth.jwt)
            .then(json => dispatch(fetchHistory()));
    }
}

export function login(username, password) {
    return dispatch => {
        let jwt, profile;

        return AuthService.askLogin(username, password)
            .then(json => {
                jwt = json.token;
                return jwt;
            })
            .then(jwt => ApiService.getMe(jwt))
            .then(me => {
                profile = me;
            })
            .then(() => dispatch(authenticateSuccess(jwt, profile)))
    }
}

export function logout() {
    return dispatch => {
        return AuthService.logout()
            .then(json => dispatch(authenticateNull()));
    }
}


function authenticateRequest() {
    return {
        type: AUTH_REQUEST
    }
}
function authenticateSuccess(jwt, profile) {
    localStorage.setItem(AuthService.JWT_LS_KEY, jwt);

    return {
        type: AUTH_SUCCESS,
        jwt: jwt,
        profile: profile
    };
}
function authenticateNull() {
    return {
        type: AUTH_NULL
    };
}
export function authenticate() {
    return dispatch => {
        dispatch(authenticateRequest());

        let jwt = localStorage.getItem(AuthService.JWT_LS_KEY);
        if(jwt) {
            ApiService.getMe(jwt)
                .then(profile =>
                    dispatch(authenticateSuccess(jwt, profile)));
        } else {
            dispatch(authenticateNull());
        }
    }
}
