import keys from 'lodash/keys';
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';

const defaultHeaders = {  };

// todo replace request par fetch

const responseHandler = (next, name, optionalObject) => (err, res) => {
  if (err) {
    return next({
      type: `${name}_ERROR`,
      err,
    });
  }

  const data = res.text && res.type && res.type === 'application/json'
    ? JSON.parse(res.text)
    : {};

  next({
    type: `${name}_SUCCESS`,
    optionalObject,
    data,
  });
};

const sendRequest = (req, name, next, params, headers, optionalObject) => {
  // Set headers
  const allHeaders = merge({}, defaultHeaders, headers);
  keys(allHeaders).forEach(h => req.set(h, allHeaders[h]));

  req.send(isEmpty(params) ? null : params);
  req.end(responseHandler(next, name, optionalObject));
};

export const getApiGenerator = next => ({ route, name, optionalObject = {} }) => {
  request
    .get(route)
    .end(responseHandler(next, name, optionalObject));
};

export const postApiGenerator = next => ({ route, name, params = {}, headers = {}, optionalObject = {} }) => {
  const req = request.post(route);
  sendRequest(req, name, next, params, headers, optionalObject);
};

export const putApiGenerator = next => ({ route, name, params = {}, headers = {}, optionalObject = {} }) => {
  const req = request.put(route);
  sendRequest(req, name, next, params, headers, optionalObject);
};

export const deleteApiGenerator = next => ({ route, name, params = {}, headers = {}, optionalObject = {} }) => {
  const req = request.delete(route);
  sendRequest(req, name, next, params, headers, optionalObject);
};
