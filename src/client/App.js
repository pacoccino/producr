import React, { Component } from 'react';
import { connect } from 'react-redux';

import History from './containers/History';
import Header from './containers/Header';
import LoginPage from './containers/LoginPage';

import { fetchMe }  from './actions';

const LoggedApp = () => (
    <div className="App">
        <Header />
        <History />
    </div>
);

class App extends Component {

    componentWillMount() {
        this.props.fetchMe();
    }

    render() {
        return (
            this.props.user ?
                <LoggedApp />
                :
                <LoginPage/>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
