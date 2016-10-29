import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import { TableRow, TableRowColumn } from 'material-ui/Table';

import IconButton from 'material-ui/IconButton';
import PlaylistAddCheck from 'material-ui/svg-icons/av/playlist-add-check';
import PlaylistPlay from 'material-ui/svg-icons/av/playlist-play';
import SkipNext from 'material-ui/svg-icons/av/skip-next';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';
import Info from 'material-ui/svg-icons/action/info';
import FileCloudDownload from 'material-ui/svg-icons/file/cloud-download';
import appTheme from '../theme';

const styles = {
    col: {
        overflow: 'hidden'
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

    formatDate(timestamp) {
        return moment(new Date(timestamp)).format("DD-MM-YYYY HH:mm:ss");
    }

    render() {
        const play = this.props.play;
        return (
            <TableRow>
                <TableRowColumn style={styles.col}>
                    {play.track.user.username}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {play.track.title}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {this.formatDate(play.played_at)}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    { play.played_duration ?
                        <span>{play.played_duration}<i>s</i></span>
                        :
                        <span><i>?</i></span>
                    }
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {this.listenedState(play.played_state)}
                </TableRowColumn>
                <TableRowColumn>
                    <IconButton
                        tooltip="Go to track's page"
                        href={play.track.permalink_url}
                        target="about_blank"
                        style={{verticalAlign: 'initial'}}
                        hoverColor={appTheme.palette.primary2Color}
                    >
                        <OpenInNew
                            hoverColor={appTheme.palette.primary2Color}
                        />
                    </IconButton>
                    <IconButton
                        tooltip="Download"
                    >
                        <FileCloudDownload
                            hoverColor={appTheme.palette.primary2Color}
                        />
                    </IconButton>
                </TableRowColumn>
            </TableRow>
        );
    }
}

export default HistoryPlay;