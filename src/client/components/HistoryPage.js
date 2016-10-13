import React, { Component, PropTypes } from 'react';

import HistoryPlay from './HistoryPlay';

const styles = {
    line: {
        width: '100%'
    }
};

class HistoryPage extends Component {

    static propTypes = {
        history: PropTypes.array.isRequired
    };

    render() {
        return (
            <div style={styles.line}>
                {
                    this.props.history.map((play, index) =>
                        <HistoryPlay play={play} key={index} />
                    )
                }
            </div>
        );
    }
}

export default HistoryPage;
