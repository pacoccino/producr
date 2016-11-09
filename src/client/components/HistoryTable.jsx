import React, { Component, PropTypes } from 'react';

import HistoryPlay from './HistoryPlay';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableBody } from 'material-ui/Table';

const colStyle = (width) => {
    return {
        width: width + 'px'
    }
};

class HistoryTable extends Component {

    static propTypes = {
        history: PropTypes.array.isRequired
    };

    render() {
        return (
            <Table selectable={false}>
                <TableBody displayRowCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={colStyle(80)} tooltip="Track's artist">Artist</TableHeaderColumn>
                        <TableHeaderColumn style={colStyle(120)} tooltip="Track's title">Title</TableHeaderColumn>
                        <TableHeaderColumn style={colStyle(50)} tooltip="Date of song play">Date</TableHeaderColumn>
                        <TableHeaderColumn style={colStyle(50)} tooltip="Estimation of play duration">Duration</TableHeaderColumn>
                        <TableHeaderColumn style={colStyle(30)} tooltip="Estimation if the song was actually played">State</TableHeaderColumn>
                        <TableHeaderColumn style={colStyle(30)}>Open</TableHeaderColumn>
                    </TableRow>
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

export default HistoryTable;
