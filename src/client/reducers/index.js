import { combineReducers } from 'redux';

import auth from './auth';
import transactions from './transactions';
import userHistory from './history';
import wallet from './wallet';

const rootReducer = combineReducers({
    auth,
    userHistory,
    transactions,
    wallet
});

export default rootReducer;