const _ = require('lodash');

const ClassModel = require('./classModel');

class HistoryPlay extends ClassModel {

    constructor(initialObject) {
        super(initialObject);
        if(this.played_duration && !this.played_state) {
            this.played_state = this.getListenedState();
        }
    }

    _getProperties() {
        return {
            _id: null,
            track: null,
            artist: null,
            player: null,
            played_at: null,
            played_duration: null,
            played_state: null,
            transaction_id: null,
        };
    }


    getListenedState() {
        const diff = this.played_duration;
        const songLength = this.track && this.track.duration; // What's track.full_duration ?

        if(_.isNil(diff)) {
            // We need to have another track in history to estimate played_duration
            return HistoryPlay.ListenedStates.LISTENING;

        } else if(songLength && diff > songLength) {
            // Diff is greater than track duration, user exited application so we cannot know play duration.
            // Can suppose that track is listened
            return HistoryPlay.ListenedStates.OVERTRACK;

        } else if(diff < HistoryPlay.ListenDurations.SKIP) {
            return HistoryPlay.ListenedStates.SKIPPED;

        } else {
            // Here we could compute percentage played_duration/track_duration to estimate listen
            // But still keeping minimum time (not to pay very short track&demos
            return HistoryPlay.ListenedStates.LISTENED;
        }
    }
}

HistoryPlay.ListenedStates = {
        LISTENING: 'LISTENING',
        LISTENED: 'LISTENED',
        SKIPPED: 'SKIPPED',
        OVERTRACK: 'OVERTRACK'
};
HistoryPlay.ListenDurations = {
        SKIP: 10
};

module.exports = HistoryPlay;