const _ = require('lodash');
const async = require('async');

const DBModels = require('../dbModels');
const SoundCloudSugar = require('../../soundcloud/index').Sugar;

const Transactions = {

    getUserTransactions: (user) => {

        const sc_id = user.sc_id.toString();
        const query = {
            '$or': [
                {
                    fromUserScId: sc_id
                },
                {
                    toUserScId: sc_id
                }
            ]
        };

        return DBModels.Transactions.find(query);
    },

    getTransactionsFromUser: (user) => {

        const sc_id = user.sc_id.toString();
        const query = {
            fromUserScId: sc_id
        };

        return DBModels.Transactions.find(query);
    },

    getTransactionsToUser: (user) => {

        const sc_id = user.sc_id.toString();
        const query = {
            toUserScId: sc_id
        };

        return DBModels.Transactions.find(query);
    },

    newTransaction(transaction) {
        return DBModels.Transactions.insert(transaction);
    },

    hydrateTransaction(transaction) {
        const promises = [];

        promises.push(SoundCloudSugar.getUser(transaction.fromUserScId)
            .then(user => {
                transaction.fromUserScId = user.username;
            }));
        promises.push(SoundCloudSugar.getUser(transaction.toUserScId)
            .then(user => {
                transaction.toUserScId = user.username;
            }));
        promises.push(SoundCloudSugar.getTrack(transaction.trackId)
            .then(track => {
                transaction.trackId = track.title;
            }));

        return Promise.all(promises).then(() => transaction);
    },
    hydrateTransactions(transactions) {
        return new Promise((resolve, reject) => {
            async.map(transactions, (transaction, cb) => {
                Transactions.hydrateTransaction(transaction)
                    .then(hydratedTransaction => {
                        cb(null, hydratedTransaction);
                    })
                    .catch(err => {
                        cb(err);
                    });
            }, (err, hydratedTransactions) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(hydratedTransactions);
                }
            });
        });
    }
};

module.exports = Transactions;