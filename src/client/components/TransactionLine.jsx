import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import { TableRow, TableRowColumn } from 'material-ui/Table';

import PC from './PC';

const styles = {
    col: {
        overflow: 'hidden'
    },
    pc: {
        top: '-1px',
        position: 'relative',
    }
};

// TODO distinguer lignes from et to avec couleur ou sigle
class TransactionLine extends Component {
    static propTypes = {
        type: PropTypes.string,
        transaction: PropTypes.object.isRequired
    };

    render() {
        const transaction = this.props.transaction;
        const date = moment(new Date(transaction.date));

        const transactionDate = date.format("DD-MM-YYYY");
        const transactionHour = date.format("HH:mm");
        let userColumns = null;
        const fromColumn =
            <TableRowColumn style={styles.col} key="from_column">
                {transaction.from.username}
            </TableRowColumn>;
        const toColumn =
            <TableRowColumn style={styles.col} key="to_column">
                {transaction.to.username}
            </TableRowColumn>;

        if(this.props.type === "fromme") {
            userColumns = [toColumn];
        } else if(this.props.type === "tome") {
            userColumns = [fromColumn];
        } else {
            userColumns = [fromColumn, toColumn];
        }
        return (
            <TableRow>
                {userColumns}
                <TableRowColumn style={styles.col}>
                    {transaction.track.title}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {transactionHour} <br/> {transactionDate}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    <span>
                        {transaction.amount}<PC style={styles.pc}/>
                    </span>
                </TableRowColumn>
            </TableRow>
        );
    }
}

export default TransactionLine;