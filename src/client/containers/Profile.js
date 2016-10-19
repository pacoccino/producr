import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Paper, Avatar } from 'material-ui';

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
    headerTextLine: {
        // textAlign: 'left'
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
    }
};


class Profile extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    };

    render() {
        return (
            <Paper style={styles.paper}>
                <div style={styles.profileHeader}>
                    <Avatar src={this.props.user.avatar_url} size={100} style={styles.avatar}/>
                    <div style={styles.headerText}>
                        <p style={styles.headerTextLine}>{this.props.user.username}</p>
                        <p style={styles.headerTextLine}>{this.props.user.city}</p>
                    </div>
                    <RaisedButton label="Logout" secondary={true} onClick={this.props.logout} style={styles.logoutBtn}/>
                </div>

                <div style={styles.detailsSection}>
                    <div>
                        <div style={styles.detailTitle}>Followers</div>
                        <div style={styles.detailValue} >{this.props.user.followers_count}</div>
                    </div>
                    <div style={styles.detailSeparator} />
                    <div>
                        <div style={styles.detailTitle}>Followings</div>
                        <div style={styles.detailValue} >{this.props.user.followings_count}</div>
                    </div>
                    <div style={styles.detailSeparator} />
                    <div>
                        <div style={styles.detailTitle}>Tracks</div>
                        <div style={styles.detailValue} >{this.props.user.track_count}</div>
                    </div>
                </div>
                {/*Description: {this.props.user.description} <br/>*/}
                {/*Playlists: {this.props.user.playlist_count} <br/>*/}
                {/*Likes: {this.props.user.likes_count} <br/>*/}
                {/*Profile: <a href={this.props.user.permalink_url}>{this.props.user.permalink_url}</a> <br/>*/}
            </Paper>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);