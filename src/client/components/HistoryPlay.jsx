import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import { TableRow, TableRowColumn } from 'material-ui/Table';

import IconButton from 'material-ui/IconButton';
import PlaylistAddCheck from 'material-ui/svg-icons/av/playlist-add-check';
import PlaylistPlay from 'material-ui/svg-icons/av/playlist-play';
import SkipNext from 'material-ui/svg-icons/av/skip-next';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';
import Info from 'material-ui/svg-icons/action/info';

import appTheme from '../theme';

const styles = {
    col: {
        overflow: 'hidden',
    },
    linkIcon: {
        verticalAlign: 'initial',
        margin: 0,
        padding: '10px 0',
        position: 'relative',
        width: 0,
        height: 0,
    }
};

class HistoryPlay extends Component {
    static propTypes = {
        play: PropTypes.object.isRequired
    };

    listenedState(state) {
        switch(state) {
            case 'LISTENED':
                return <PlaylistAddCheck color="green"/>;
            case 'LISTENING':
                return <PlaylistPlay color="blue" />;
            case 'SKIPPED':
                return <SkipNext color="orange" />;
            default:
                return <Info />;
        }
    }


    render() {

        const play = this.props.play;
        const date = moment(new Date(play.played_at));

        const playDate = date.format("DD-MM-YYYY");
        const playHour = date.format("HH:mm");
        return (
            <TableRow>
                <TableRowColumn style={styles.col}>
                    {play.artist.username}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {play.track.title}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {playHour} <br/> {playDate}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    { play.played_duration }s
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {this.listenedState(play.played_state)}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    <IconButton
                        href={play.track.permalink_url}
                        target="about_blank"
                        style={styles.linkIcon}
                    >
                        <OpenInNew
                            hoverColor={appTheme.palette.primary2Color}
                        />
                    </IconButton>
                </TableRowColumn>
            </TableRow>
        );
    }
}

export default HistoryPlay;