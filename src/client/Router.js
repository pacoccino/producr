import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import queryString from 'query-string';

import AuthService from './services/AuthService';
import LoginPage from './containers/LoginPage';

import History from './containers/HistoryPage';
import Transactions from './containers/TransactionsPage';
import AppPage from './components/AppPage';
import NoMatch from './components/NoMatch';
import FAQ from './components/FAQ';
import FullLoader from './components/FullLoader';
import Welcome from './components/Welcome';
import Profile from './containers/Profile';

import { checkAuthentication }  from './actions/auth';

// import store from './store';
// const history = syncHistoryWithStore(browserHistory, store);
const history = browserHistory;

const checkOAuth = (authCallback) => (nextState, replace, callback) => {

    const qs = queryString.parse(nextState.location.search);
    AuthService.oAuthCallback(qs.code)
        .then(() =>{
            replace('/');
            authCallback();
            callback();
        })
        .catch(() => {
            replace('/');
            // TODO catch oauth error
            callback();
        });
};

const LoggedApp = () => (
    <Router history={history}>
        <Route path="/" component={AppPage}>
            <Route path="/history" component={History} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/profile" component={Profile} />
            <Route path="/qa" component={FAQ} />
            <Route path="/*" component={NoMatch} />
            <IndexRoute component={History} />
        </Route>
    </Router>
);

const NotLoggedApp = ({ authCallback }) => (
    <Router history={history}>
        <Route path="/" component={AppPage}>
            <Route path="/auth/callback" onEnter={checkOAuth(authCallback)} />
            <Route path="/welcome" component={Welcome} />
            <Route path="/qa" component={FAQ} />
            <Route path="/login" component={LoginPage} />
            <Redirect from="/*" to="/welcome" />
            <Route path="/*" component={NoMatch} />
            <IndexRoute component={Welcome} />
        </Route>
    </Router>
);

class AppRouter extends Component {

    static propTypes = {
        auth: PropTypes.object.isRequired,
        checkAuthentication: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.checkAuthentication();
    }

    render() {
        if(this.props.auth.isFetching) {
            return <FullLoader />;
        } else {
            if(this.props.auth.isAuthenticated) {
                return <LoggedApp />;
            } else {
                return <NotLoggedApp authCallback={this.props.checkAuthentication} />;
            }
        }
    }
}

const mapStateToProps = ({ auth }) => {
    return {
        auth
    };
};
const mapDispatchToProps = {
    checkAuthentication
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
