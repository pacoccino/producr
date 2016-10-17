const Record = require('immutable').Record;

const HistoryTrack = new Record({
    urn: null,
    songId: null,
    url: null,
    played_at: null,
    played_duration: null,
    played_state: null,
    artist: null,
    title: null
}, 'HistoryTrack');


module.exports = HistoryTrack;