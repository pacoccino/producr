import AuthService from '../services/AuthService';
import ApiService from '../services/ApiService';

export const AUTH_NULL = 'AUTH_NULL';
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_ERROR = 'AUTH_ERROR';

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

export function checkAuthentication() {
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