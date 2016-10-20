import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Paper, Avatar } from 'material-ui';

import { lightGreenA700 } from 'material-ui/styles/colors';

import RaisedButton from 'material-ui/RaisedButton';

import appTheme from '../theme';
import { logout }  from '../actions';

const styles = {
    paper: {
        marginTop: 30,
        width: '100%',
        textAlign: 'center'
    },
    profileHeader: {
        height: 140,
        width: '100%',
        backgroundColor: '#c3a292',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box'
    },
    logoutBtn: {
        width: 50,
        height: 50,
        marginRight: 20
    },
    avatar: {
        margin: 20
    },
    headerText: {
        color: appTheme.palette.alternateTextColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    detailsSection: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '30px 0',
        color: appTheme.palette.softTextColor,
        textAlign: 'left'
    },
    detailTitle: {
        fontSize: 14
    },
    detailValue: {
        fontSize: 24
    },
    detailSeparator: {
        height: '45px',
        width: '1px',
        backgroundColor: appTheme.palette.primary3Color
    },
    separator: {
        height: '1px',
        width: '96%',
        margin: 'auto',
        backgroundColor: appTheme.palette.clockCircleColor
    }
};


class Profile extends Component {
    static propTypes = {
        profile: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    };

    render() {
        return (
            <Paper style={styles.paper}>
                <div style={styles.profileHeader}>
                    <a href={this.props.profile.permalink_url}>
                        <Avatar src={this.props.profile.avatar_url} size={100} style={styles.avatar}/>
                    </a>
                    <div style={styles.headerText}>
                        <p style={{fontSize: 22}}>{this.props.profile.username}</p>
                        <p style={{fontSize: 18}}>{this.props.profile.city}</p>
                    </div>
                    <RaisedButton label="Logout" secondary={true} onClick={this.props.logout} style={styles.logoutBtn}/>
                </div>

                <div style={styles.detailsSection}>
                    <div>
                        <div style={styles.detailTitle}>Followers</div>
                        <div style={styles.detailValue} >{this.props.profile.followers_count}</div>
                    </div>
                    <div style={styles.detailSeparator} />
                    <div>
                        <div style={styles.detailTitle}>Followings</div>
                        <div style={styles.detailValue} >{this.props.profile.followings_count}</div>
                    </div>
                    <div style={styles.detailSeparator} />
                    <div>
                        <div style={styles.detailTitle}>Tracks</div>
                        <div style={styles.detailValue} >{this.props.profile.track_count}</div>
                    </div>
                </div>
                <div style={styles.separator} />
                <div style={{
                    marginBottom: 30
                }}>
                    <h2 style={{
                        marginLeft: 40,
                        color: appTheme.palette.softTextColor,
                        textAlign: 'left'
                    }}
                    >Wallet</h2>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{}}>
                            Your balance:
                        </div>
                        <Paper
                        circle={true}
                        style={{
                            backgroundColor: lightGreenA700,
                            width: '80px',
                            height: '80px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: 15
                        }}
                        >
                            7.65€
                        </Paper>
                    </div>
                    <RaisedButton label="Charge" primary={true} style={{margin: 20}}/>
                </div>
            </Paper>
        );
    }
}


const mapStateToProps = ({ auth }) => {
    return {
        profile: auth.profile
    };
};

const mapDispatchToProps = {
    logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);