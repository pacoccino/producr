import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Paper, Avatar } from 'material-ui';

import appTheme from '../theme';

const styles = {
    paper: {
        width: '100%',
        textAlign: 'center'
    },
    profileHeader: {
        height: 140,
        width: '100%',
        display: 'inline-flex',
        backgroundColor: '#c3a292',

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
        textAlign: 'left'
    }
};


class Profile extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired
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
                </div>
                First Name: {this.props.user.first_name} <br/>
                Last Name: {this.props.user.last_name} <br/>
                Description: {this.props.user.description} <br/>
                City: {this.props.user.city} <br/>
                Track_count: {this.props.user.track_count} <br/>
                Playlists: {this.props.user.playlist_count} <br/>
                Likes: {this.props.user.likes_count} <br/>
                Followers: {this.props.user.followers_count} <br/>
                Followings: {this.props.user.followings_count} <br/>
                Profile: <a href={this.props.user.permalink_url}>{this.props.user.permalink_url}</a> <br/>
            </Paper>
        );
    }
}


function mapStateToProps(state) {
    const { user } = state;
    return {
        user
    };
}

export default connect(mapStateToProps)(Profile);