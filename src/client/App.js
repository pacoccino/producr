import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import 'isomorphic-fetch';

import Router from './Router';
import reducer from './reducers';
import appTheme from './theme';

import './index.css';

const store = createStore(reducer,
    applyMiddleware(
        thunkMiddleware
    )
);

const App = () => (
    <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(appTheme)}>
            <Router />
        </MuiThemeProvider>
    </Provider>
);

module.exports = App;
