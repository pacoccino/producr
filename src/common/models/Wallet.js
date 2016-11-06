const Record = require('immutable').Record;

const Wallet = new Record({
    _id: null,
    balance: 0,
    user_id: null
}, "Wallet");


module.exports = Wallet;