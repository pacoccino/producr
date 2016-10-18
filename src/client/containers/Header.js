import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';

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
    menuButton: {
        height: '100%',
        padding: '5px 0px',
        color: appTheme.palette.accent2Color,
        hoverColor: appTheme.palette.accent1Color

    },
    profileGroup: {
        backgroundColor: appTheme.palette.primary1Color,
        width: '184px'
    },
    titleGroup: {
        backgroundColor: appTheme.palette.headerBlack
    },
    title: {
        color: appTheme.palette.alternateTextColor,
        fontSize: 24,
        padding: '15px 20px'
    },
    buttosnsGroup: {
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
                        <ToolbarGroup>
                            <MenuItem
                                leftIcon={<Avatar src={this.props.user.avatar_url} />}
                                primaryText={this.props.user.username}
                                style={styles.menuButton}
                                linkButton={true} href="/profile"
                            />
                            <MenuItem
                                primaryText="History"
                                style={styles.menuButton}
                                linkButton={true} href="/history"
                            />
                        </ToolbarGroup>

                        <ToolbarGroup style={styles.titleGroup}>
                            <span style={styles.title}>SoundCloud producr</span>
                        </ToolbarGroup>

                        <ToolbarGroup style={styles.buttosnsGroup}>
                            {this.props.user ?
                                <MenuItem
                                    onClick={this.props.logout}
                                    primaryText="Logout"
                                    style={styles.menuButton}
                                />
                                :
                                <MenuItem
                                    primaryText="Login"
                                    style={styles.menuButton}
                                />
                            }
                        </ToolbarGroup>
                    </Toolbar>
                </div>
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