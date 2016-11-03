const _ = require('lodash');
const async = require('async');

const DBModels = require('../dbModels');
const Config = require('../config');
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
        const options = {
            sort: { date: -1 }
        };

        return DBModels.Transactions.find(query, options);
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

    askPlayTransaction(historyPlay) {
        // TODO check wallet
        // const userWallet = Wallet.getUserWallet(user);

        let transactionAmount = user.config && user.config.pricePerPlay || Config.appDefaults.defaultPricePerPlay;

        let transaction = {
            date: Date.now(),

            from: historyPlay.player,
            to: historyPlay.artist,
            track: historyPlay.track,

            amount: transactionAmount,

            playId: historyPlay._id.toString()
        };

        // TODO revert changes if one fails
        return Promise.resolve()
            .then(()             => DBModels.Users.getById(historyPlay.player.sc_id, "sc_id"))
            .then(fromUser       => Wallet.updateUserWallet({fromUser, addedBalance: -transactionAmount}))
            .then(fromUserWallet => DBModels.Users.getById(historyPlay.artist.sc_id, "sc_id"))
            .then(toUser         => Wallet.updateUserWallet({toUser, addedBalance: transactionAmount}))
            .then(toUserWallet   => DBModels.Transactions.insert(transaction))
            .then(insertedTransaction => {
                historyPlay = historyPlay.set("transaction_id", transaction._id.toString());
                return DBModels.HistoryPlays.updateField(historyPlay, "transaction_id")
                    .then(() => insertedTransaction);
            });
    }
};

module.exports = Transactions;