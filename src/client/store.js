import { createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import sendApiMiddleware from './middlewares/sendApiMiddleware'
import reducer from './reducers';

const enhancers = applyMiddleware(
  thunkMiddleware,
  sendApiMiddleware
);

const store = createStore(
  reducer,
  enhancers
);

export default store;