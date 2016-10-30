import * as WalletActions from '../actions/wallet';

const fetchDefaultState = {
    isFetching: true
};

function wallet(state = fetchDefaultState, action) {
    switch (action.type) {
        case WalletActions.REQUEST_WALLET:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case WalletActions.RECEIVE_WALLET:
            return Object.assign({}, state, {
                isFetching: false,
                ...action.wallet
            });
        default:
            return state;
    }
}

export default wallet;