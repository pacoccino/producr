import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Paper, RaisedButton } from 'material-ui';

import FullLoader from '../components/FullLoader';
import AuthService from '../services/AuthService';
import PC from '../components/PC';

import { checkAuthentication, authenticateRequest }  from '../actions/auth';
import appTheme from '../theme';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center'
    },
    paper: {
        width: '100%',
        padding: 20,
        textAlign: 'center',
    },
    header: {
        color: appTheme.palette.accent3Color
    }
};

class LoginCallback extends Component {

    constructor(props) {
        super(props);

        this.state = {
            welcoming: false
        };

        this.endLogin = this.endLogin.bind(this);
    }
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

    showWelcome(username) {
        // TODO if user doesnt click, doesnt update app
        this.setState({
            welcoming: true,
            username: username || "pacopac"
        });
    }

    endLogin() {
        this.context.router.push('/');
        this.props.checkAuthentication();
    }
    failLogin() {
        this.context.router.push('/login?oauthError=true');
    }

    checkOAuth() {
        // TODO show message and wait for update
        const code = this.props.location.query.code;
        AuthService.oAuthCallback(code)
            .then(res =>{
                if(res.authInfo && res.authInfo.isNew) {
                    this.showWelcome(res.authInfo.username);
                } else {
                    this.endLogin();
                }
            })
            .catch(() => this.failLogin());
    };

    render() {
        if(this.state.welcoming) {
            return (
                <div style={styles.container}>
                    <Paper style={styles.paper}>
                        <h2 style={styles.header}>Hello, {this.state.username}</h2>
                        <p>This is your first connection to producr !</p>
                        <p>To celebrate this, we offer your 500<PC/> that you can spend on the platform.</p>
                            <RaisedButton
                                fullWidth={true}
                                label="Thank you, let's try this !"
                                primary={true}
                                onClick={this.endLogin}
                            />

                    </Paper>
                </div>
            );
        } else {
            return <FullLoader />;
        }
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
