import { getApiGenerator, postApiGenerator, putApiGenerator, deleteApiGenerator } from '../helpers/apiGenerator';
import * as api from '../constants/api';
import * as actions from '../constants/actionTypes';

const sendApiMiddleware = store => next => action => {
  next(action);

  const getApi = getApiGenerator(next);
  const postApi = postApiGenerator(next);
  const putApi = putApiGenerator(next);
  const deleteApi = deleteApiGenerator(next);

  switch (action.type) {
    case actions.GET_WALLET: {
      getApi({
        route: api.GET_WALLET(),
        name: actions.GET_WALLET,
      });
      break;
    }
  }
};

export default sendApiMiddleware;
