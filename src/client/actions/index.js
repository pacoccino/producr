import AuthService from '../services/AuthService';
import ApiService from '../services/ApiService';

export const ACTION_NULL = 'ACTION_NULL';
export const REQUEST_HISTORY = 'REQUEST_HISTORY';
export const RECEIVE_HISTORY = 'RECEIVE_HISTORY';
export const REQUEST_WALLET = 'REQUEST_WALLET';
export const RECEIVE_WALLET = 'RECEIVE_WALLET';
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

export function oAuthLogin() {
    AuthService.oAuthLogin();

    return {
        type: ACTION_NULL
    };
}
export function loginPW(username, password) {
    return dispatch => {
        return AuthService.askLoginPW(username, password)
            .then(profile => dispatch(authenticateSuccess(profile)))
    }
}

export function logout() {
    return dispatch => {
        return AuthService.logout()
            .then(() => dispatch(authenticateNull()));
    }
}


function authenticateRequest() {
    return {
        type: AUTH_REQUEST
    }
}
function authenticateSuccess(profile) {
    return {
        type: AUTH_SUCCESS,
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

        ApiService.getMe()
            .then(profile => {
                dispatch(authenticateSuccess(profile));
            })
            .catch(() => {
                dispatch(authenticateNull());
            });
    }
}

function requestWallet() {
    return {
        type: REQUEST_WALLET,
    };
}

function receiveWallet(wallet) {
    return {
        type: RECEIVE_WALLET,
        wallet,
        receivedAt: Date.now()
    };
}

export function fetchWallet() {
    return (dispatch) => {
        dispatch(requestWallet());
        return ApiService.getWallet()
            .then(json => dispatch(receiveWallet(json)));
    }
}

export function updateWallet() {
    return (dispatch) => {
        dispatch(requestWallet());
        return ApiService.updateWallet()
            .then(json => dispatch(fetchWallet()));
    }
}
