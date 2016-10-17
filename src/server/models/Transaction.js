const Record = require('immutable').Record;

const Transaction = new Record({
    _id: null,
    fromUserId: null,
    toUserId: null,
    amount: 0,
    date: Date.now(),
    songId: null,
    playId: null,
}, 'Transaction');


module.exports = Transaction;