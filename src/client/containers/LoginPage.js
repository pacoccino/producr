import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { login, logout }  from '../actions';

class LoginPage extends Component {
    static propTypes = {
        login: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    };

    submit() {
        const username = this.emailNode.value;
        const password = this.passwordNode.value;
        this.props.login(username, password);
    }

    render() {
        return (
            <div>
                <input type="text" ref={ node => this.emailNode = node } placeholder="email" defaultValue="pakokrew@gmail.com"/>
                <input type="password" ref={ node => this.passwordNode = node } placeholder="password" defaultValue="fachomarin"/>
                <button onClick={this.submit.bind(this)}>Login</button>
                <button onClick={this.props.logout}>Logout</button>
            </div>
        );
    }
}

const mapDispatchToProps = {
    login,
    logout
};

export default connect(null, mapDispatchToProps)(LoginPage);
