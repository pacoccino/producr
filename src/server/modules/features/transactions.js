const _ = require('lodash');

const DBModels = require('../dbModels');

const Transactions = {

    getUserTransactions: (user) => {

        const userId = user._id.toString();
        const query = {
            '$or': [
                {
                    fromUserId: userId
                },
                {
                    toUserId: userId
                }
            ]
        };

        return DBModels.Transactions.find(query);
    },

    getTransactionsFromUser: (user) => {

        const userId = user._id.toString();
        const query = {
            fromUserId: userId
        };

        return DBModels.Transactions.find(query);
    },

    getTransactionsToUser: (user) => {

        const userId = user._id.toString();
        const query = {
            toUserId: userId
        };

        return DBModels.Transactions.find(query);
    },

    newTransaction(transaction) {
        return DBModels.Transactions.create(transaction);
    }
};

module.exports = Transactions;