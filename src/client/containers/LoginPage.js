import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { AppBar, Paper, TextField, RaisedButton } from 'material-ui';

import { login, logout }  from '../actions';


const styles = {
    paper: {
        width: 400,
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    form: {
        padding: '40px'
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

    submit() {
        const username = this.state.email;
        const password = this.state.password;
        this.props.login(username, password);
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
                <Paper style={styles.paper}>
                    <AppBar
                        title="SoundCloud Login"
                        showMenuIconButton={false}
                    />
                    <div style={styles.form}>

                        <TextField
                            hintText="skrillex@owsla.us"
                            floatingLabelText="Email address"
                            floatingLabelFixed={true}
                            onChange={this.changeMail.bind(this)}
                        /><br />
                        <TextField
                            hintText="ilovebassmusic"
                            floatingLabelText="Password"
                            type="password"
                            onChange={this.changePass.bind(this)}
                        /><br />
                        <div style={{marginTop: 10}}>
                            <RaisedButton onClick={this.submit.bind(this)} label="Login" />
                            <RaisedButton onClick={this.props.logout} label="Logout" />
                        </div>
                    </div>
                </Paper>

            </div>
        );
    }
}

const mapDispatchToProps = {
    login,
    logout
};

export default connect(null, mapDispatchToProps)(LoginPage);
