import * as TransactionsActions from '../actions/transactions';

const fetchDefaultState = {
    isFetching: false
};

function transactions(state = fetchDefaultState, action) {
    switch (action.type) {
        case TransactionsActions.REQUEST_TRANSACTIONS:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case TransactionsActions.RECEIVE_TRANSACTIONS:
            return Object.assign({}, state, {
                isFetching: false,
                transactions: action.transactions
            });
        default:
            return state;
    }
}

export default transactions;