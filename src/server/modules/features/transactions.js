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

    // create artist user when doesnt exists
    _createArtistUser(historyPlay) {
        return DBModels.Users.insert({
            sc_id: historyPlay.artist.sc_id
        })
            .catch(err => {
                // in case of parallel execution, double insert can happen
                if(err.code === 11000) {
                    return DBModels.Users.getById(historyPlay.artist.sc_id, "sc_id");
                } else {
                    throw err;
                }
            });
    },
    // Get necessary data for a play transaction: users, amount
    _prepareTransaction (historyPlay) {
        const transactionData = {};
        let defaultAmount = Config.appDefaults.defaultPricePerPlay;

        return Promise.resolve()
            .then(()       => DBModels.Users.getById(historyPlay.player.sc_id, "sc_id"))
            .then(fromUser => {
                transactionData.fromUser = fromUser;
                transactionData.amount = fromUser.config && fromUser.config.pricePerPlay || defaultAmount;
            })
            .then(()       => DBModels.Users.getById(historyPlay.artist.sc_id, "sc_id"))
            .then(toUser   => {
                if(toUser) {
                    transactionData.toUser = toUser;
                } else {
                    Transactions._createArtistUser(historyPlay)
                        .then(artistUser => {
                            transactionData.toUser = artistUser;
                        });
                }
            })
            .then(() => transactionData);
    },
    // Update users wallet from a transaction
    _updateWallets (transactionData) {

        return Promise.resolve()
            .then(() =>
                Wallet.updateUserWallet({
                    user: transactionData.fromUser,
                    addedBalance: -transactionData.amount
                })
            )
            .then(() =>
                Wallet.updateUserWallet({
                    user: transactionData.toUser,
                    addedBalance: transactionData.amount
                })
            )
            .then(() => transactionData);
    },

    askPlayTransaction(historyPlay) {

        return Transactions._prepareTransaction(historyPlay)
            .then(transactionData => Transactions._updateWallets(transactionData))
            .then(transactionData => {
                    let transaction = {
                        date: Date.now(),

                        from: historyPlay.player,
                        to: historyPlay.artist,
                        track: historyPlay.track,

                        amount: transactionData.amount,

                        play_id: historyPlay._id.toString()
                    };
                    return DBModels.Transactions.insert(transaction);
                }
            )
            .then(insertedTransaction => {
                historyPlay.transaction_id = insertedTransaction._id.toString();
                return DBModels.HistoryPlays.updateField(historyPlay, "transaction_id")
                    .then(() => insertedTransaction);
            });
    }
};

module.exports = Transactions;