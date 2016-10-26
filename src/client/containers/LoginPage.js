import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { AppBar, Paper, TextField, RaisedButton } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import validator from 'validator';

import { login, logout, oAuthLogin }  from '../actions';
import appTheme from '../theme';

const styles = {
    paper: {
        width: 400,
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    form: {
        padding: '40px'
    },
    formElement: {
        width: '100%'
    },
    floatingLabelStyle: {
        color: appTheme.palette.pickerHeaderColor
    },
    loginDesc: {
        color: appTheme.palette.accent3Color
    },
    whyLink: {
        color: appTheme.palette.accent1Color,
        marginLeft: 5,
        cursor: 'pointer'
    }
};

class LoginPage extends Component {
    static propTypes = {
        login: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        oAuthLogin: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            email: '',
            password: '',
            emailError: "",
            passwordError: "",
            whyOpen: false
        };

        // this.changeMail.bind(this);
        // this.changePass.bind(this);
        // this.submit.bind(this);
    }


    switchWhy() {
        this.setState({whyOpen: !this.state.whyOpen});
    }

    handleSubmit(e) {
        if(e) e.preventDefault();

        this.validateForm().then(() => {
            const username = this.state.email;
            const password = this.state.password;
            this.props.login(username, password);
        }).catch(() => null);
    }

    validateForm() {
        const isEmailValid = validator.isEmail(this.state.email);
        if(isEmailValid) {
            this.setState({emailError: ""});
        } else {
            this.setState({emailError: "Invalid email address"});
        }

        const isPasswordValid = !validator.isEmpty(this.state.password);
        if(isPasswordValid) {
            this.setState({passwordError: ""});
        } else {
            this.setState({passwordError: "Please enter your password"});
        }

        if(isEmailValid && isPasswordValid) {
            return Promise.resolve()
        }
        return Promise.reject();
    }

    changeMail(e) {
        this.setState({
            ...this.getState,
            email: e.target.value
        });
    }
    changePass(e) {
        this.setState({
            ...this.getState,
            password: e.target.value
        });
    }
    render() {
        return (
            <div>
                <AppBar
                    title="SoundCloud producr"
                    showMenuIconButton={false}
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Paper style={styles.paper}>
                        <AppBar
                            title="Login"
                            showMenuIconButton={false}
                        />
                        <div style={styles.form}>
                            <i style={styles.loginDesc}>
                                Please connect with your soundcloud email and password.
                            </i>
                            <a style={styles.whyLink} onClick={this.switchWhy.bind(this)}>
                                Why ?
                            </a>
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <TextField
                                    name="email"
                                    style={styles.formElement}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    hintText="skrillex@owsla.us"
                                    floatingLabelText="Email address"
                                    floatingLabelFixed={true}
                                    onChange={this.changeMail.bind(this)}
                                    errorText={this.state.emailError}
                                /><br />
                                <TextField
                                    name="password"
                                    style={styles.formElement}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    hintText="ilovebassmusic"
                                    floatingLabelText="Password"
                                    floatingLabelFixed={true}
                                    type="password"
                                    onChange={this.changePass.bind(this)}
                                    errorText={this.state.passwordError}
                                /><br />
                                <div
                                    style={{marginTop: 10}}
                                >
                                    <RaisedButton
                                        fullWidth={true}
                                        label="Login"
                                        style={{backgroundColor:'#f50'}}
                                        type="submit"
                                    />
                                    <RaisedButton
                                        fullWidth={true}
                                        label="OauthLogin"
                                        style={{backgroundColor:'#f50'}}
                                        onClick={this.props.oAuthLogin}
                                    />
                                </div>
                            </form>
                        </div>
                        <Dialog
                            actions={[
                                <FlatButton
                                    label="I understand"
                                    primary={true}
                                    onTouchTap={this.switchWhy}
                                />
                            ]}
                            modal={false}
                            open={this.state.whyOpen}
                            onRequestClose={this.switchWhy}
                        >
                            SoundCloud API has some limitations with classic OAuth connections.<br/>
                            For the needs of this applications we need to authenticate you with your email/password.<br/>
                            Don't worry, we don't keep your credentials and they are transfered securely.
                        </Dialog>
                    </Paper>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    login,
    logout,
    oAuthLogin
};

export default connect(null, mapDispatchToProps)(LoginPage);
