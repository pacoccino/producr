import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
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
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

import appTheme from '../theme';

import { logout }  from '../actions';

const styles = {
    header: {
        backgroundColor: appTheme.palette.headerBlack,
        width: '100%'
    },
    toolbar: {
        backgroundColor: appTheme.palette.headerBlack,
        width: '764px',
        margin: 'auto'
    },
    menuGroup: {
        backgroundColor: appTheme.palette.primary1Color,
        width: '63px'
    },
    titleGroup: {
        backgroundColor: appTheme.palette.headerBlack
    },
    title: {
        color: appTheme.palette.alternateTextColor,
        fontSize: 24,
        padding: '15px 20px'
    },
    profileGroup: {
        backgroundColor: appTheme.palette.headerBlack
    },
    primaryButton: {
        color: appTheme.palette.alternateTextColor
    },
    button: {
        color: appTheme.palette.alternateTextColor,
        margin: 0,
        height: '100%',
        width: '100%',
        fontSize: '20px',
        textTransform: 'uppercase'
    },
    separator: {
        backgroundColor: 'white'
    }
};

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
                <div style={styles.header}>
                    <Toolbar showMenuIconButton={false}
                             noGutter={true}
                             style={styles.toolbar}
                    >
                        <ToolbarGroup
                            style={styles.menuGroup}
                        >

                            <IconButton tooltip="Open menu"
                                        onClick={this.handleToggle}
                                        style={styles.button}
                                        tooltipPosition="bottom-right">
                                <MenuIcon color={appTheme.palette.alternateTextColor}/>
                            </IconButton>
                        </ToolbarGroup>
                        <ToolbarGroup
                            style={styles.titleGroup}
                        >
                            <span style={styles.title}>SoundCloud producr</span>
                        </ToolbarGroup>

                        <ToolbarGroup
                            style={styles.profileGroup}
                        >
                            {this.props.user ?
                                <FlatButton label="Logout"
                                            onClick={this.props.logout}
                                            style={styles.button}
                                />
                                :
                                <FlatButton label="Login"
                                            style={styles.button}
                                />
                            }
                        </ToolbarGroup>
                    </Toolbar>
                </div>

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