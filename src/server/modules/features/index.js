const Features = {};

Features.init = () => {
    Features.History = require('./history');
    Features.Transactions = require('./transactions');
    Features.Users = require('./users');
    Features.Wallet = require('./wallet');
};

module.exports = Features;