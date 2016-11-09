import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';

import HeaderButton from '../components/HeaderButton';
import appTheme from '../theme';

import { logout }  from '../actions/auth';

const styles = {
    header: {
        backgroundColor: appTheme.palette.headerBlack,
        width: '100%',
    },
    toolbar: {
        backgroundColor: appTheme.palette.headerBlack,
        width: '764px',
        margin: 'auto',
        height: 50,
    },
    menuButton: {
        height: '100%',
        padding: '5px 0px',
        color: appTheme.palette.accent2Color,
        hoverColor: appTheme.palette.accent1Color
    },
    titleGroup: {
        cursor: 'default'
    },
    title: {
        backgroundColor: appTheme.palette.primary1Color,
        color: appTheme.palette.alternateTextColor,
        fontSize: 24,
        padding: '15px 20px'
    },
};

const Separator = () => (
    <div style={{
        height: '100%',
        width: '1px',
        backgroundColor: 'rgba(0, 0, 0, 0.51)'
    }}></div>
);

class Header extends Component {
    static propTypes = {
        auth: PropTypes.object,
        logout: PropTypes.func.isRequired
    };

    render() {
        let authColumns = null;
        let profile = this.props.auth.profile;
        if(!this.props.auth.isFetching) {
            if(profile) {
                authColumns =
                    <HeaderButton href="/profile">
                        <div>
                            <Avatar
                                style={{marginRight: 10}}
                                src={profile.avatar_url}
                                size={25}
                            />
                        </div>
                        <div>
                            {profile.username}
                        </div>
                    </HeaderButton>
                ;
            } else {
                // TODO is shown on first welcome screen
                authColumns =
                    <HeaderButton href="/login">
                        <div>
                            Login
                        </div>
                    </HeaderButton>
                ;
            }
        }
        return (
            <div>
                <div style={styles.header}>
                    <Toolbar
                        noGutter={true}
                        style={styles.toolbar}
                    >
                        <ToolbarGroup style={styles.titleGroup}>
                            <HeaderButton href="/" style={styles.title}>
                                producr
                            </HeaderButton>

                            {
                                profile ?
                                    <div style={{display: 'inherit'}}>
                                        <HeaderButton href="/history">
                                            History
                                        </HeaderButton>
                                        <Separator/>
                                        <HeaderButton href="/transactions">
                                            Transactions
                                        </HeaderButton>
                                        <Separator/>
                                    </div>
                                    : null
                            }

                            <HeaderButton href="/qa">
                                Q&A
                            </HeaderButton>
                            <Separator/>
                        </ToolbarGroup>

                        <ToolbarGroup>
                            <Separator/>
                            { authColumns }
                            <Separator/>
                        </ToolbarGroup>
                    </Toolbar>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    return {
        auth
    };
};


const mapDispatchToProps = {
    logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);