import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { AppBar, Paper, TextField, RaisedButton } from 'material-ui';
import UpArrow from 'material-ui/svg-icons/navigation/arrow-drop-up';
import DownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import validator from 'validator';

import { loginPW, oAuthLogin }  from '../actions/auth';
import appTheme from '../theme';

const styles = {
    paper: {
        width: '80%',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    mainLoginSection: {
        margin: 20
    },
    oAuthBtn: {
    },
    openCred: {
        margin: 20,
        color: appTheme.palette.accent3Color,
        fontSize: 13,
        cursor: 'pointer'
    },
    form: {
        // display: 'none',
        padding: '40px'
    },
    formElement: {
        width: '100%'
    },
    floatingLabelStyle: {
        color: appTheme.palette.pickerHeaderColor
    },
    oauthDesc: {
        color: appTheme.palette.accent3Color
    },
    loginDesc: {
        color: appTheme.palette.accent3Color
    },
    whyLink: {
        color: appTheme.palette.accent1Color,
        marginLeft: 5,
        cursor: 'pointer'
    },
    credArrow: {
        position: 'relative',
        top: 6
    }
};

class LoginPage extends Component {
    static propTypes = {
        loginPW: PropTypes.func.isRequired,
        oAuthLogin: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            email: '',
            password: '',
            emailError: "",
            passwordError: "",
            whyOpen: false,
            credOpen: false
        };

        this.switchWhy = this.switchWhy.bind(this);
        this.switchCred = this.switchCred.bind(this);
    }

    switchWhy() {
        this.setState({whyOpen: !this.state.whyOpen});
    }
    switchCred() {
        this.setState({
            credOpen: !this.state.credOpen
        });
    }

    handleSubmit(e) {
        if(e) e.preventDefault();

        this.validateForm().then(() => {
            const username = this.state.email;
            const password = this.state.password;
            this.props.loginPW(username, password);
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
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Paper style={styles.paper}>
                        <AppBar
                            title="Login"
                            showMenuIconButton={false}
                        />

                        <div style={styles.mainLoginSection}>

                            <p style={styles.oauthDesc}>
                                <b>producr</b> need to be linked with your SoundCloud account.
                                <br/>
                                You will be asked your credentials and to authorize our application.
                            </p>

                            <RaisedButton
                                label="Connect with SoundCloud"
                                primary={true}
                                onClick={this.props.oAuthLogin}
                                style={styles.oAuthBtn}
                            />
                            <div
                                style={styles.openCred}
                                onClick={this.switchCred}
                            >
                                Or connect with your credentials {this.state.credOpen ? <UpArrow color={styles.openCred.color} style={styles.credArrow}/>: <DownArrow color={styles.openCred.color} style={styles.credArrow}/>}
                            </div>
                        </div>

                        {
                            this.state.credOpen ?
                                <div style={styles.form}>
                                    <i style={styles.loginDesc}>
                                        You can also connect with your soundcloud email and password.
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
                                                onClick={this.handleSubmit.bind(this)}
                                                type="submit"
                                            />
                                        </div>
                                    </form>
                                </div>
                                :
                                null
                        }
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
                            You can connect with your SoundCloud email and password. This bypass the oAuth system and give more permissions.
                            <br/>
                            SC's API has some limitations with classic OAuth connections.
                            <br/>
                            If your SoundCloud account was linked to Facebook or Google account, this may not work.
                            <br/>
                            Don't worry, we don't keep your credentials and they are transferred securely.
                        </Dialog>
                    </Paper>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    loginPW,
    oAuthLogin
};

export default connect(null, mapDispatchToProps)(LoginPage);
