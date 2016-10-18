import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';

import Login from './containers/LoginPage';

import History from './containers/History';
import AppPage from './components/AppPage';
import Profile from './containers/Profile';

import { fetchMe }  from './actions';

const NoMatch = () => (
    <div>
        <span>The resource you requested desn't exists</span>
        <Link to="/">Go home</Link>
    </div>
);

const LoggedApp = () => (
    <Router history={browserHistory}>
        <Route path="/" component={AppPage}>
            <IndexRoute component={History} />
            <Route path="/history" component={History} />
            <Route path="/profile" component={Profile} />
            <Route path="/*" component={NoMatch} />
        </Route>
    </Router>
);

class AppRouter extends Component {

    componentWillMount() {
        this.props.fetchMe();
    }

    render() {
        return (
            this.props.user ?
                <LoggedApp />
                :
                <Login/>
        );
    }
}

const mapStateToProps = (state) => {
    const { user } = state;

    return {
        user
    };
};
const mapDispatchToProps = {
    fetchMe
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
