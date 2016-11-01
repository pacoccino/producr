const ObjectId = require('bson').ObjectId;
const Record = require('immutable').Record;


// TODO Gerer modele nested
// TODO allouer objectId plus proprement

const HistoryTrack = new Record({
    _id: null,

    track: null,
    artist: null,
    player: null,

    played_at: null,
    played_duration: null,
    played_state: null,

    transaction_id: null
}, 'HistoryTrack');

/*
 const HistoryTrack = function(values) {
 values._id = values._id || new ObjectId();
 return HistoryTrackO(values);
 };
 */

module.exports = HistoryTrack;