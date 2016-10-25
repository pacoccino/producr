const Record = require('immutable').Record;

const Wallet = new Record({
    _id: null,
    balance: 0
}, "Wallet");


module.exports = Wallet;