import React, { Component, PropTypes } from 'react';

import HistoryPlay from './HistoryPlay';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableBody } from 'material-ui/Table';

const styles = {
    line: {
        // width: '100%'
    }
};

class HistoryPage extends Component {

    static propTypes = {
        history: PropTypes.array.isRequired
    };

    render() {
        return (
            <div style={styles.line}>
                <Table
                    selectable={false}>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}>

                        <TableRow>
                            <TableHeaderColumn colSpan="3" tooltip="All songs you recently listened" style={{textAlign: 'center'}}>
                                Listening history
                            </TableHeaderColumn>
                        </TableRow>
                        <TableRow>
                            <TableHeaderColumn tooltip="SoundCloud song's ID">ID</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Track's artist">Artist</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Track's title">Title</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Date of song play">Played at</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Estimation of played duration">Played duration</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}>
                        {
                            this.props.history.map((play, index) =>
                                <HistoryPlay play={play} key={index} />
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default HistoryPage;
