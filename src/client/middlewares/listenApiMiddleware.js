import * as api from '../actions/api';
import * as types from '../constants/actionTypes';

const listenApiMiddleware = app => store => next => action => {
  next(action);

  switch (action.type) {
    case types.GET_WALLET_SUCCESS: {
      console.log("got wallet", action.wallet);
      store.dispatch(api.getOtherThing());
      break;
    }
  }
};

export default listenApiMiddleware;
