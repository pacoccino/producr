import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import { TableRow, TableRowColumn } from 'material-ui/Table';

import IconButton from 'material-ui/IconButton';
import ActionFlightTakeoff from 'material-ui/svg-icons/action/flight-takeoff';
import FileCloudDownload from 'material-ui/svg-icons/file/cloud-download';

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
                return <ActionFlightTakeoff color="green"/>;
            case 'LISTENING':
                return <ActionFlightTakeoff color="blue" />;
            case 'SKIPPED':
                return <ActionFlightTakeoff color="orange" />;
            default:
                return 'Unknown';
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
                    {play.artist}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {play.title}
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
                        href={play.url}
                        target="about_blank"
                        style={{verticalAlign: 'initial'}}
                    >
                        <FileCloudDownload color="#f50"/>
                    </IconButton>
                    <IconButton tooltip="Download">
                        <FileCloudDownload />
                    </IconButton>
                </TableRowColumn>
            </TableRow>
        );
    }
}

export default HistoryPlay;