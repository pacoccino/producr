const Record = require('immutable').Record;

const HistoryPlay = new Record({
    _id: null,

    track: null,
    artist: null,
    player: null,

    played_at: null,
    played_duration: null,
    played_state: null,

    transaction_id: null
}, 'HistoryPlay');

module.exports = HistoryPlay;