import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { AppBar, Paper, Avatar } from 'material-ui';


const styles = {
    paper: {
        width: 400,
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    }
};


class Profile extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired
    };

    render() {
        return (
            <div>
                <Paper style={styles.paper}>
                    <AppBar
                        title="Profile"
                        showMenuIconButton={false}
                    />
                    <Avatar src={this.props.user.avatar_url} />
                    Username: {this.props.user.username} <br/>
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
            </div>
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