import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Paper, Avatar } from 'material-ui';

import appTheme from '../theme';

const styles = {
    paper: {
        marginTop: 30,
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
    },
    detailsSection: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '30px 0'
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
                <div style={styles.detailsSection}>
                    <div>
                        <div>Followers</div>
                        <div>{this.props.user.followers_count}</div>
                    </div>
                    <div>
                        <div>Followings</div>
                        <div>{this.props.user.followings_count}</div>
                    </div>
                    <div>
                        <div>Tracks</div>
                        <div>{this.props.user.track_count}</div>
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


function mapStateToProps(state) {
    const { user } = state;
    return {
        user
    };
}

export default connect(mapStateToProps)(Profile);