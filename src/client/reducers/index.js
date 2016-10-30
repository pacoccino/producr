import { combineReducers } from 'redux';

import auth from './auth';
import userHistory from './history';
import wallet from './wallet';

const rootReducer = combineReducers({
    auth,
    userHistory,
    wallet
});

export default rootReducer;