import React, { Component, PropTypes } from 'react';
import {  ListItem} from 'material-ui/List';


class HistoryPlay extends Component {
    static propTypes = {
        play: PropTypes.object.isRequired
    };

    render() {
        const play = this.props.play;

        return (
            <ListItem
                primaryText={
                    play.title + '(' + play.date + ', ' + play.played_duration + 's)'
                }
                secondaryText={
                    play.artist
                }>
            </ListItem>
        );
    }
}

export default HistoryPlay;