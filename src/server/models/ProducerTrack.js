const Record = require('immutable/record');

const ProducerTrack = new Record({
    id: null,
    url: null,
    created_date: null,
    play_count: null,
    title: null
});

module.exports = ProducerTrack;