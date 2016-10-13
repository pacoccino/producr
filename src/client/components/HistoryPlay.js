import React, { Component, PropTypes } from 'react';

const styles = {
    line: {
        display: 'flex'
    },
    part: {

    }
};

class HistoryPlay extends Component {
    static propTypes = {
        play: PropTypes.object.isRequired
    };

    render() {
        const play = this.props.play;

        return (
            <div style={styles.line}>
                <div style={styles.part}><b>Title:</b> {play.title}</div>
                <div style={styles.part}><b>Artist:</b> {play.artist}</div>
                <div style={styles.part}><b>Date:</b> {play.date}</div>
                <div style={styles.part}><b>Duration:</b> {play.played_duration}</div>
            </div>
        );
    }
}

export default HistoryPlay;