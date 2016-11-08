import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux'

import auth from './auth';
import transactions from './transactions';
import userHistory from './history';
import wallet from './wallet';

const rootReducer = combineReducers({
    auth,
    userHistory,
    transactions,
    wallet,

    routing: routerReducer
});

export default rootReducer;