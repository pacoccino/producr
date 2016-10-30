import ApiService from '../services/ApiService';

export const REQUEST_TRANSACTIONS = 'REQUEST_TRANSACTIONS';
export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS';

function requestTransactions() {
    return {
        type: REQUEST_TRANSACTIONS,
    };
}

function receiveTransactions(transactions) {
    return {
        type: RECEIVE_TRANSACTIONS,
        transactions,
        receivedAt: Date.now()
    };
}

export function fetchTransactions(type) {
    return (dispatch) => {
        dispatch(requestTransactions());
        return ApiService.getTransactions(type)
            .then(json => dispatch(receiveTransactions(json)));
    }
}
