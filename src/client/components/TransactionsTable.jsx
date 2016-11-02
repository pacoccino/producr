import React, { Component, PropTypes } from 'react';

import TransactionLine from './TransactionLine';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableBody } from 'material-ui/Table';

class TransactionsTable extends Component {

    static propTypes = {
        type: PropTypes.string,
        transactions: PropTypes.array.isRequired
    };

    render() {
        let userColumns = null;
        const fromColumn =
            <TableHeaderColumn tooltip="Transaction came from this user">From</TableHeaderColumn>;
        const toColumn =
            <TableHeaderColumn tooltip="Transaction went to this user">To</TableHeaderColumn>;

        if(this.props.type === "fromme") {
            userColumns = [toColumn];
        } else if(this.props.type === "tome") {
            userColumns = [fromColumn];
        } else {
            userColumns = [fromColumn, toColumn];
        }
        return (
            <Table
                selectable={false}>
                <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}>
                    <TableRow>
                        {userColumns}
                        <TableHeaderColumn tooltip="Song that started the transaction">Track</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Date of transaction">Date</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Transaction amount">Amount</TableHeaderColumn>
                        {/*<TableHeaderColumn>Actions</TableHeaderColumn>*/}
                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={false}>
                    {
                        this.props.transactions.map((transaction, index) =>
                            <TransactionLine transaction={transaction} type={this.props.type} key={index} />
                        )
                    }
                </TableBody>
            </Table>
        );
    }
}

export default TransactionsTable;
