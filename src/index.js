import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk'

import 'isomorphic-fetch';

import App from './client/App';
import reducer from './client/reducers/index';

import './client/index.css';

const store = createStore(reducer,
    applyMiddleware(
        thunkMiddleware
    )
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
  document.getElementById('root')
);
