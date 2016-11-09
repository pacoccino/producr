import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import FullLoader from '../components/FullLoader';
import AuthService from '../services/AuthService';

import { checkAuthentication, authenticateRequest }  from '../actions/auth';

class LoginCallback extends Component {
    componentDidMount() {
        this.checkOAuth();
    }

    static propTypes = {
        checkAuthentication: PropTypes.func.isRequired,
        authenticateRequest: PropTypes.func.isRequired,
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    checkOAuth() {
        this.props.authenticateRequest();

        const code = this.props.location.query.code;
        AuthService.oAuthCallback(code)
            .then(() =>{
                this.context.router.push('/');
                this.props.checkAuthentication();
            })
            .catch(() => {
                this.context.router.push('/login?oauthError=true');
            });
    };

    render() {
        return <FullLoader />;
    }
}

const mapStateToProps = ({ auth }) => {
    return {
        auth
    };
};

const mapDispatchToProps = {
    checkAuthentication,
    authenticateRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginCallback);
