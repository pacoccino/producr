const ObjectId = require('bson').ObjectId;
const Record = require('immutable').Record;

// TODO allouer objectId plus proprement
const HistoryTrack = new Record({
    _id: null,
    track_id: null,
    permalink_url: null,
    played_by_sc_id: null,
    played_at: null,
    played_duration: null,
    played_state: null,
    artist: null,
    title: null,
    transaction_id: null
}, 'HistoryTrack');

/*
 const HistoryTrack = function(values) {
 values._id = values._id || new ObjectId();
 return HistoryTrackO(values);
 };
 */

module.exports = HistoryTrack;