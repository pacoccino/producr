import React, { Component, PropTypes } from 'react';

import TransactionLine from './TransactionLine';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableBody } from 'material-ui/Table';

import appTheme from '../theme';

const noTrans = {
    color: appTheme.palette.accent3Color
};
class TransactionsTable extends Component {

    static propTypes = {
        type: PropTypes.string,
        transactions: PropTypes.array.isRequired
    };

    render() {
        if(this.props.transactions.length) {
            return this.renderTable();
        } else {
            return this.renderNoTrans();
        }
    }
    renderNoTrans() {
        return (
            <div>
                <p style={noTrans}>You have no transactions</p>
            </div>
        );
    }
    renderTable() {
        let userColumns = null;
        const fromColumn =
            <TableHeaderColumn tooltip="Transaction came from this user" key="from_column">From</TableHeaderColumn>;
        const toColumn =
            <TableHeaderColumn tooltip="Transaction went to this user" key="to_column">To</TableHeaderColumn>;

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
                <TableBody displayRowCheckbox={false}>
                    <TableRow>
                        {userColumns}
                        <TableHeaderColumn tooltip="Song that started the transaction">Track</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Date of transaction">Date</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Transaction amount">Amount</TableHeaderColumn>
                        {/*<TableHeaderColumn>Actions</TableHeaderColumn>*/}
                    </TableRow>
                    {
                        this.props.transactions.map(transaction =>
                            <TransactionLine transaction={transaction} type={this.props.type} key={transaction._id} />
                        )
                    }
                </TableBody>
            </Table>
        );
    }
}

export default TransactionsTable;
