import React from 'react';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import 'isomorphic-fetch';

import RouterManager from './Router';
import store from './store';
import appTheme from './theme';

import './index.css';

const App = () => (
    <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(appTheme)}>
            <RouterManager />
        </MuiThemeProvider>
    </Provider>
);

module.exports = App;
