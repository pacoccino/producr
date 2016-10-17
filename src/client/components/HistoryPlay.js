import React, { Component, PropTypes } from 'react';

import { TableRow, TableRowColumn } from 'material-ui/Table';

const styles = {
    col: {
        overflow: 'hidden'
    }
};

class HistoryPlay extends Component {
    static propTypes = {
        play: PropTypes.object.isRequired
    };

    render() {
        const play = this.props.play;

        return (
            <TableRow>
                <TableRowColumn style={styles.col}>
                    {play.id || 0}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {play.artist}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {play.title}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {play.date}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {play.played_duration}
                </TableRowColumn>
            </TableRow>
        );
    }
}

export default HistoryPlay;