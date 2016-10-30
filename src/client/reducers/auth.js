import * as AuthActions from '../actions/auth';

const authDefaultState = {
    isFetching: true,
    isAuthenticated: false
};

function auth(state = authDefaultState, action) {
    switch (action.type) {
        case AuthActions.AUTH_REQUEST:
            return Object.assign({}, {
                isFetching: true,
                isAuthenticated: false
            });
        case AuthActions.AUTH_NULL:
            return Object.assign({}, {
                isFetching: false,
                isAuthenticated: false
            });
        case AuthActions.AUTH_SUCCESS:
            return Object.assign({}, {
                isFetching: false,
                isAuthenticated: true,
                jwt: action.jwt,
                profile: action.profile
            });
        case AuthActions.AUTH_ERROR:

            return Object.assign({}, {
                isFetching: false,
                isAuthenticated: false,
                error: action.error,
            });
        default:
            return state;
    }
}

export default auth;