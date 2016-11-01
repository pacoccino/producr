const _ = require('lodash');
const async = require('async');

const DBModels = require('../dbModels');
const SoundCloudSugar = require('../../soundcloud/index').Sugar;
const Wallet = require('./wallet');

const Transactions = {

    getUserTransactions: (user) => {

        const sc_id = user.sc_id;
        const query = {
            '$or': [
                {
                    "from.sc_id": sc_id
                },
                {
                    "to.sc_id": sc_id
                }
            ]
        };

        return DBModels.Transactions.find(query);
    },

    getTransactionsFromUser: (user) => {

        const sc_id = user.sc_id;
        const query = {
            "from.sc_id": sc_id
        };

        return DBModels.Transactions.find(query);
    },

    getTransactionsToUser: (user) => {

        const sc_id = user.sc_id;
        const query = {
            "to.sc_id": sc_id
        };

        return DBModels.Transactions.find(query);
    },

    newTransaction(transaction) {
        return DBModels.Transactions.insert(transaction);
    },

    hydrateTransaction(transaction) {
        const promises = [];

        promises.push(SoundCloudSugar.getUser(transaction.from.sc_id)
            .then(user => {
                transaction.from.username = user.username;
            }));
        promises.push(SoundCloudSugar.getUser(transaction.to.sc_id)
            .then(user => {
                transaction.to.username = user.username;
            }));
        promises.push(SoundCloudSugar.getTrack(transaction.track.id)
            .then(track => {
                transaction.track.title = track.title;
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
    },

    askTransaction({ user, historyPlay }) {
        // TODO check wallet and remove money
        // const userWallet = Wallet.getUserWallet(user);

        let transaction = {

            from: historyPlay.player,
            to: historyPlay.artist,
            track: historyPlay.track,

            amount: user.config && user.config.pricePerPlay || 1, // TODO default price

            playId: historyPlay._id.toString()
        };

        return DBModels.Transactions.insert(transaction);
    }
};

module.exports = Transactions;