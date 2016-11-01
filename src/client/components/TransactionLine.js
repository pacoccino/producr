import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import { TableRow, TableRowColumn } from 'material-ui/Table';

import IconButton from 'material-ui/IconButton';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';
import FileCloudDownload from 'material-ui/svg-icons/file/cloud-download';
import appTheme from '../theme';

const styles = {
    col: {
        overflow: 'hidden'
    }
};

// TODO distinguer lignes from et tout avec couleur ou sigle
class TransactionLine extends Component {
    static propTypes = {
        type: PropTypes.string,
        transaction: PropTypes.object.isRequired
    };

    formatDate(timestamp) {
        return moment(new Date(timestamp)).format("DD-MM-YYYY HH:mm:ss");
    }

    render() {
        const transaction = this.props.transaction;
        let userColumns = null;
        const fromColumn =
            <TableRowColumn style={styles.col}>
                {transaction.from.username}
            </TableRowColumn>;
        const toColumn =
            <TableRowColumn style={styles.col}>
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
                    {this.formatDate(transaction.date)}
                </TableRowColumn>
                <TableRowColumn style={styles.col}>
                    {transaction.amount}
                </TableRowColumn>
                {/*<TableRowColumn>
                    <IconButton
                        tooltip="Go to track's page"
                        href=""
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
                </TableRowColumn>*/}
            </TableRow>
        );
    }
}

export default TransactionLine;