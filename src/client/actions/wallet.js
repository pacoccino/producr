import ApiService from '../services/ApiService';

export const REQUEST_WALLET = 'REQUEST_WALLET';
export const RECEIVE_WALLET = 'RECEIVE_WALLET';

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
