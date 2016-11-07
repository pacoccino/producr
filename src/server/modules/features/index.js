const Features = {};

Features.init = () => {
    Features.History = require('./history');
    Features.Transactions = require('./transactions');
    Features.Users = require('./Users');
    Features.Wallet = require('./Wallet');
};

module.exports = Features;