const _ = require('lodash');
const async = require('async');

const DBModels = require('../dbModels');
const Config = require('../../../common/config');
const SoundCloudSugar = require('../../soundcloud/index').Sugar;

const Features = require('./index');

const Transactions = {

    INSUFFICIENT_FOUNDS: "INSUFFICIENT_FOUNDS",
    getUserTransactions: (user, params) => {
        params = params || {};

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
            limit: params.limit || 10,
            skip: params.skip || 0,
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
                    return Features.Users.getByScId(historyPlay.artist.sc_id)
                        .then(artistUser => {
                            if(artistUser) {
                                return artistUser;
                            } else {
                                throw "Error while retrieving artist User";
                            }
                        });
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
            .then(()       => Features.Users.getByScId(historyPlay.player.sc_id))
            .then(fromUser => {
                transactionData.fromUser = fromUser;
                transactionData.amount = fromUser.config && fromUser.config.pricePerPlay || defaultAmount;
            })
            .then(() => Features.Transactions._verifyWalletBalance(transactionData))
            .then(()       => Features.Users.getByScId(historyPlay.artist.sc_id))
            .then(toUser   => {
                if(toUser) {
                    transactionData.toUser = toUser;
                } else {
                    return Transactions._createArtistUser(historyPlay)
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
                Features.Wallet.updateUserWallet({
                    user: transactionData.fromUser,
                    addedBalance: -transactionData.amount
                })
            )
            .then(() =>
                Features.Wallet.updateUserWallet({
                    user: transactionData.toUser,
                    addedBalance: transactionData.amount
                })
            )
            .then(() => transactionData);
    },
    // Verify if user can afford transaction
    _verifyWalletBalance (transactionData) {

        return Promise.resolve()
            .then(() => Features.Wallet.getUserWallet(transactionData.fromUser))
            .then(playerWallet => {
                if (transactionData.amount <= playerWallet.balance) {
                    return transactionData;
                } else {
                    throw Transactions.INSUFFICIENT_FOUNDS;
                }
            });
    },

    askPlayTransaction(historyPlay) {

        return Features.Transactions._prepareTransaction(historyPlay)
            .then(transactionData => Features.Transactions._updateWallets(transactionData))
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
            })
            .catch(error => {
                if(error === Transactions.INSUFFICIENT_FOUNDS) {
                    return false;
                } else {
                    throw error;
                }
            });
    }
};

module.exports = Transactions;