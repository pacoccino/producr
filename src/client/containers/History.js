import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import HistoryPage from '../components/HistoryPage';

import { fetchHistory } from '../actions';

class History extends Component {
    static propTypes = {
        userHistory: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.dispatch(fetchHistory());
    }

    render() {
        return (
            this.props.userHistory.isFetching ?
                <div>Loading...</div>
                :
                <HistoryPage history={this.props.userHistory.history}/>
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