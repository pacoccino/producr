import React, { Component, PropTypes } from 'react';

import HistoryPlay from './HistoryPlay';

import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';

const styles = {
    line: {
        // width: '100%'
    }
};

class HistoryPage extends Component {

    static propTypes = {
        history: PropTypes.array.isRequired
    };

    render() {
        return (
            <div style={styles.line}>
                <List>
                {
                    this.props.history.map((play, index) =>
                        <div key={index}>
                            <HistoryPlay play={play} />
                            <Divider inset={true} />
                        </div>
                    )
                }
                </List>
            </div>
        );
    }
}

export default HistoryPage;
