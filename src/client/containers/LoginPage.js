import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { AppBar, Paper, TextField, RaisedButton } from 'material-ui';

import { login, logout }  from '../actions';
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
    }
};

class LoginPage extends Component {
    static propTypes = {
        login: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            email: '',
            password: ''
        };

        // this.changeMail.bind(this);
        // this.changePass.bind(this);
        // this.submit.bind(this);
    }

    handleSubmit(e) {
        if(e) e.preventDefault();
        this.validateForm().then(() => {
            const username = this.state.email;
            const password = this.state.password;
            this.props.login(username, password);
        })
        .catch(() => null);
    }

    validateForm() {
        const validateEmail = (email) => {
            return email !== "";
        };
        const validatePassword = (password) => {
            return password !== "";
        };
        if(validateEmail(this.state.email) && validatePassword(this.state.password)) {
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
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <TextField
                                    style={styles.formElement}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    hintText="skrillex@owsla.us"
                                    floatingLabelText="Email address"
                                    floatingLabelFixed={true}
                                    onChange={this.changeMail.bind(this)}
                                /><br />
                                <TextField
                                    style={styles.formElement}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    hintText="ilovebassmusic"
                                    floatingLabelText="Password"
                                    floatingLabelFixed={true}
                                    type="password"
                                    onChange={this.changePass.bind(this)}
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
                                </div>
                            </form>

                        </div>
                    </Paper>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    login,
    logout
};

export default connect(null, mapDispatchToProps)(LoginPage);
