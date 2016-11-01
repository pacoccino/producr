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

        const sc_id = user.sc_id;
        const query = {
            fromUserScId: sc_id
        };

        return DBModels.Transactions.find(query);
    },

    getTransactionsToUser: (user) => {

        const sc_id = user.sc_id;
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
                transaction.fromUserName = user.username;
            }));
        promises.push(SoundCloudSugar.getUser(transaction.toUserScId)
            .then(user => {
                transaction.toUserName = user.username;
            }));
        promises.push(SoundCloudSugar.getTrack(transaction.trackId)
            .then(track => {
                transaction.trackTitle = track.title;
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
        // const userWallet = Wallet.getUserWallet(user);

        let transaction = {
            fromUserScId: historyPlay.player.sc_id,
            fromUserName: historyPlay.player.username,

            toUserScId: historyPlay.artist.sc_id,
            toUserName: historyPlay.artist.username,

            trackId: historyPlay.track.id,
            trackTitle: historyPlay.track.title,

            amount: user.config && user.config.pricePerPlay || 1,

            playId: historyPlay._id.toString()
        };

        return DBModels.Transactions.insert(transaction);
    }
};

module.exports = Transactions;