import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import PersonAdd from 'material-ui/svg-icons/social/person-add';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import ContentInbox from 'material-ui/svg-icons/content/inbox';


import { logout }  from '../actions';

class Header extends Component {
    static propTypes = {
        user: PropTypes.object,
        logout: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {openDrawer: false};
    }

    handleToggle = () => this.setState({openDrawer: !this.state.openDrawer});

    render() {
        return (
            <div>

                <AppBar
                    title="SoundCloud producr"
                    onLeftIconButtonTouchTap={this.handleToggle}
                    iconElementRight={this.props.user ?
                        <FlatButton label="Logout" onClick={this.props.logout} />
                        :
                        <FlatButton label="Login" />
                    }
                />

                <Drawer
                    open={this.state.openDrawer}
                    docked={false}>
                    <AppBar
                        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
                        onLeftIconButtonTouchTap={this.handleToggle}
                        title="Menu" />
                    <ListItem
                        primaryText={this.props.user.username}
                        leftAvatar={<Avatar src={this.props.user.avatar_url} />}
                        disabled={true}
                    />
                    <MenuItem leftIcon={<RemoveRedEye />} >History</MenuItem>
                    <MenuItem leftIcon={<PersonAdd />}>Tracks</MenuItem>
                    <MenuItem leftIcon={<ContentInbox />}>Options</MenuItem>
                </Drawer>

            </div>
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
    logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);