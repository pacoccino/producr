import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

import { logout }  from '../actions';

class Header extends Component {
    static propTypes = {
        user: PropTypes.obj,
        logout: PropTypes.func.isRequired
    };

    render() {
        return (
            <AppBar
                title="SoundCloud producr"
                showMenuIconButton={false}
                iconElementRight={this.props.user ?
                    <FlatButton label="Logout" onClick={this.props.logout} />
                    :
                    <FlatButton label="Login" />
                }
            />
        );
    }
}
Header.propTypes = {
    user: PropTypes.obj,
    logout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    const { user } = state;

    return {
        user
    };
};

const mapDispatchToProps = {
    logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);