const Record = require('immutable').Record;

// TODO nest from et to
const Transaction = new Record({
    _id: null,
    date: Date.now(),

    fromUserScId: null,
    fromUserName: null,

    toUserScId: null,
    toUserName: null,

    trackId: null,
    trackTitle: null,

    amount: 0,
    playId: null,
}, 'Transaction');


module.exports = Transaction;