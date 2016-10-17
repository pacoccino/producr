const Record = require('immutable').Record;

const PlayTrack = new Record({
    urn: null,
    songId: null,
    url: null,
    played_at: null,
    played_duration: null,
    played_state: null,
    artist: null,
    title: null
});


module.exports = PlayTrack;