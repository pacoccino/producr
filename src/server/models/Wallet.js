const Record = require('immutable').Record;

const Wallet = new Record({
    _id: null,
    balance: null
}, "Wallet");


module.exports = Wallet;