import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';

import HeaderButton from '../components/HeaderButton';
import appTheme from '../theme';

import { logout }  from '../actions';

const styles = {
    header: {
        backgroundColor: appTheme.palette.headerBlack,
        width: '100%',
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
    titleGroup: {
        backgroundColor: appTheme.palette.primary1Color,
        cursor: 'default'
    },
    title: {
        color: appTheme.palette.alternateTextColor,
        fontSize: 24,
        padding: '15px 20px'
    },
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
                        <ToolbarGroup style={styles.titleGroup}>
                            <span style={styles.title}>SoundCloud producr</span>

                            <HeaderButton href="/history">
                                History
                            </HeaderButton>
                        </ToolbarGroup>

                        <ToolbarGroup>
                            <HeaderButton href="/profile">
                                <div>
                                    <Avatar
                                        style={{marginRight: 10}}
                                        src={this.props.user.avatar_url}
                                        size={25}
                                    />
                                </div>
                                <div>
                                    {this.props.user.username}
                                </div>
                            </HeaderButton>
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