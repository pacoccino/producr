const Record = require('immutable').Record;

const Transaction = new Record({
    _id: null,
    fromUserScId: null,
    fromUserName: null,
    toUserScId: null,
    toUserScName: null,
    amount: 0,
    date: Date.now(),
    trackId: null,
    trackTitle: null,
    playId: null,
}, 'Transaction');


module.exports = Transaction;