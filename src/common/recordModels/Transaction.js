const Record = require('immutable').Record;

const TransactionRecord = new Record({
    _id: null,
    date: null,

    from: null,
    to: null,
    track: null,

    amount: 0,
    play_id: null,
}, 'Transaction');

module.exports = TransactionRecord;