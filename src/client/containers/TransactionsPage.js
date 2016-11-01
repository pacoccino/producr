import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TransactionsTable from '../components/TransactionsTable';

import { AppBar, Paper, RaisedButton } from 'material-ui';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import CircularProgress from 'material-ui/CircularProgress';
import appTheme from '../theme';

import { fetchTransactions } from '../actions/transactions';

const styles = {
    paper: {
        width: '100%',
        textAlign: 'center',
        display: 'inline-block',
        marginTop: 30
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
        marginTop: '8px',
        cursor: 'pointer'
    },
    progress: {
        margin: '40px'
    },
    selector: {
        margin: 20
    }
};

const Refresher = (isFetching, fn) => {
    const refresher = <RefreshIndicator
        size={30}
        left={0}
        top={10}
        style={styles.refresh}
        status={"ready"}
        percentage={100}
        onClick={fn}
    />;
    const refreshing = <RefreshIndicator
        size={30}
        left={0}
        top={10}
        style={styles.refresh}
        status={"loading"}
        onClick={fn}
    />;
    return isFetching ? refreshing : refresher
};


class Transactions extends Component {
    static propTypes = {
        transactions: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.refreshTransactions = this.refreshTransactions.bind(this);
        this.setTransactionType = this.setTransactionType.bind(this);

        this.state = {
            transactionType: "all"
        };
    }

    componentDidMount() {
        this.refreshTransactions();
    }

    refreshTransactions() {
        if(!this.props.transactions.isFetching)
            this.props.dispatch(fetchTransactions(this.state.transactionType));
    }

    setTransactionType(type) {
        return () => {
            this.props.dispatch(fetchTransactions(type));
            this.setState({
                transactionType: type
            });

        };
    }

    render() {
        let transactions = this.props.transactions.transactions;
        // TODO filter transactions if not done by server
        /*if(this.state.transactionType === "fromme") {
         transactions = transactions.filter(transaction => transaction.fromUserScId === "myuserid");
         }*/
        return (
            <div>
                <Paper style={styles.paper}>
                    <AppBar
                        title="Listening Transactions"
                        showMenuIconButton={false}
                    >
                        {Refresher(this.props.transactions.isFetching, this.refreshTransactions)}
                    </AppBar>

                    <div style={styles.selector}>
                        <RaisedButton
                            label="All"
                            style={{backgroundColor:'#f50'}}
                            onClick={this.setTransactionType("all")}
                            primary={this.state.transactionType === "all"}
                        />
                        <RaisedButton
                            label="From me"
                            style={{backgroundColor:'#f50'}}
                            onClick={this.setTransactionType("fromme")}
                            primary={this.state.transactionType === "fromme"}
                        />
                        <RaisedButton
                            label="To me"
                            style={{backgroundColor:'#f50'}}
                            onClick={this.setTransactionType("tome")}
                            primary={this.state.transactionType === "tome"}
                        />
                    </div>

                    {
                        (this.props.transactions.isFetching || !this.props.transactions.transactions) ?
                            <CircularProgress
                                size={80}
                                thickness={5}
                                color={appTheme.palette.accent1Color}
                                style={styles.progress}
                            />
                            :
                            <TransactionsTable
                                transactions={transactions}
                                type={this.state.transactionType}
                            />
                    }
                </Paper>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { transactions } = state;
    return {
        transactions
    };
}

export default connect(mapStateToProps)(Transactions);