const Record = require('immutable').Record;

const Transaction = new Record({
    _id: null,
    fromUserScId: null,
    toUserScId: null,
    amount: 0,
    date: Date.now(),
    trackId: null,
    playId: null,
}, 'Transaction');


module.exports = Transaction;