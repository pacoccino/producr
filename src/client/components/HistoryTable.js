import React, { Component, PropTypes } from 'react';

import HistoryPlay from './HistoryPlay';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableBody } from 'material-ui/Table';


class HistoryPage extends Component {

    static propTypes = {
        history: PropTypes.array.isRequired
    };

    render() {
        return (
            <Table
                selectable={false}>
                <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn tooltip="Track's artist">Artist</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Track's title">Title</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Date of song play">Played at</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Estimation of played duration">Played duration</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Estimation if the song was actually played">Played state</TableHeaderColumn>
                        <TableHeaderColumn>Actions</TableHeaderColumn>
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
        );
    }
}

export default HistoryPage;
