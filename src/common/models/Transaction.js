const Record = require('immutable').Record;

// TODO nest from et to
const TransactionRecord = new Record({
    _id: null,
    date: null,

    from: null,
    to: null,
    track: null,

    amount: 0,
    playId: null,
}, 'Transaction');

/*
function Transaction(source) {
    source._id = source._id || new ObjectId();
    source.date = source.date || Date.now();

    return TransactionRecord(source).toJS();
}
*/

module.exports = TransactionRecord;