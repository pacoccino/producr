import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import HistoryTable from '../components/HistoryTable';

import { AppBar, Paper } from 'material-ui';

import IconButton from 'material-ui/IconButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import { fetchHistory } from '../actions';

const styles = {
    paper: {
        width: 'calc(100% - 40px)',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
        marginTop: '8px'
    },
};

const Refresher = (isFetching, fn) => {
    const refresher = <RefreshIndicator
        size={30}
        left={0}
        top={0}
        style={styles.refresh}
        status={"ready"}
        percentage={100}
    />;
    const refreshing = <RefreshIndicator
        size={30}
        left={0}
        top={0}
        style={styles.refresh}
        status={"loading"}
    />;
    return <IconButton onTouchTap={fn}>
        {isFetching ? refreshing : refresher}
    </IconButton>
};


class History extends Component {
    static propTypes = {
        userHistory: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.refreshHistory = this.refreshHistory.bind(this);
    }

    componentDidMount() {
        this.refreshHistory();
    }

    refreshHistory() {
        this.props.dispatch(fetchHistory());
    }

    render() {
        return (
            <div style={styles.line}>
                <Paper style={styles.paper}>
                    <AppBar
                        title="Listening History"
                        showMenuIconButton={false}
                        iconElementRight={ Refresher(this.props.userHistory.isFetching, this.refreshHistory)}
                    />

                    {
                        this.props.userHistory.isFetching ?
                            <span></span>
                            :
                            <HistoryTable history={this.props.userHistory.history}/>
                    }
                </Paper>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { userHistory } = state;
    userHistory.history = userHistory.history || [];
    return {
        userHistory
    };
}

export default connect(mapStateToProps)(History);