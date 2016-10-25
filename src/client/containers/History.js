import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import HistoryTable from '../components/HistoryTable';

import { AppBar, Paper } from 'material-ui';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import CircularProgress from 'material-ui/CircularProgress';
import appTheme from '../theme';

import { fetchHistory, updateHistory } from '../actions';

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


class History extends Component {
    static propTypes = {
        userHistory: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.refreshHistory = this.refreshHistory.bind(this);
    }

    componentWillMount() {
        if(!this.props.userHistory.history) {
            this.props.dispatch(fetchHistory());
        }
    }

    refreshHistory() {
        if(!this.props.userHistory.isFetching) {
            this.props.dispatch(updateHistory());
        }
    }

    render() {
        return (
            <div>
                <Paper style={styles.paper}>
                    <AppBar
                        title="Listening History"
                        showMenuIconButton={false}
                        >
                        {Refresher(this.props.userHistory.isFetching, this.refreshHistory)}
                    </AppBar>

                    {
                        this.props.userHistory.isFetching ?
                            <CircularProgress
                                size={80}
                                thickness={5}
                                color={appTheme.palette.accent1Color}
                                style={styles.progress}
                            />
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
    return {
        userHistory
    };
}

export default connect(mapStateToProps)(History);