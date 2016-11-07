import test from 'ava';
import sinon from 'sinon';

import Config from '../../../src/server/modules/config';
import DBModel from '../../../src/server/modules/dbModels/dbModel';
import DBModels from '../../../src/server/modules/dbModels';

import Features from '../../../src/server/modules/features';
Features.init();

import HistoryPlayModel from '../../../src/common/classModels/HistoryPlay';
import TransactionModel from '../../../src/common/classModels/Transaction';
import UserModel from '../../../src/common/classModels/User';
import WalletModel from '../../../src/common/classModels/Wallet';

const mockCollection = {};
DBModels.Transactions = new DBModel(TransactionModel, mockCollection);
DBModels.HistoryPlays = new DBModel(HistoryPlayModel, mockCollection);
DBModels.Users = new DBModel(UserModel, mockCollection);

var sandbox;
test.beforeEach(function () {
    sandbox = sinon.sandbox.create();
});
test.afterEach.always(function () {
    sandbox.restore();
});

test.serial('_createArtistUser', t => {
    const playerUser = new UserModel({_id: 1, sc_id: 1});

    const playMock = new HistoryPlayModel({
        _id: "play_id",
        player: {
            sc_id: playerUser.sc_id
        },
        artist: {
            sc_id: "whatever"
        },
        track: {
            id: 3
        }
    });

    let artistUser = null;
    sandbox.stub(DBModels.Users, "insert", function(user) {
        t.is(user.sc_id, "whatever");
        artistUser = new UserModel(user);
        return Promise.resolve(artistUser);
    });

    return Features.Transactions._createArtistUser(playMock)
        .then(artistUser => {
            t.is(artistUser.sc_id, "whatever");
        });
});
test.serial('_createArtistUser - already exists', t => {
    const playerUser = new UserModel({_id: 1, sc_id: 1});
    const artistUser = new UserModel({_id: 2, sc_id: "whatever"});

    const playMock = new HistoryPlayModel({
        _id: "play_id",
        player: {
            sc_id: playerUser.sc_id
        },
        artist: {
            sc_id: artistUser.sc_id
        },
        track: {
            id: 3
        }
    });

    sandbox.stub(DBModels.Users, "getById", function(id, field) {
        t.is(field, "sc_id");
        t.is(id, artistUser.sc_id);
        return Promise.resolve(artistUser);
    });
    sandbox.stub(DBModels.Users, "insert", function() {
        const error = new Error("E11000 duplicate key error");
        error.code = 11000;
        return Promise.reject(error);
    });

    return Features.Transactions._createArtistUser(playMock)
        .then(artistUserR => {
            t.is(artistUserR.sc_id, artistUser.sc_id);
        });
});

test.serial('_prepareTransaction - no artist user', t => {
    const playerUser = new UserModel({_id: 1, sc_id: 1});

    const playMock = new HistoryPlayModel({
        _id: "play_id",
        player: {
            sc_id: playerUser.sc_id
        },
        artist: {
            sc_id: "whatever"
        },
        track: {
            id: 3
        }
    });

    let artistUser = null;
    sandbox.stub(DBModels.Users, "insert", function(user) {
        t.is(user.sc_id, "whatever");
        artistUser = new UserModel(user);
        return Promise.resolve(artistUser);
    });

    sandbox.stub(DBModels.Users, "getById", function(id, field) {
        t.is(field, "sc_id");
        if(id === 1) {
            return Promise.resolve(playerUser);
        } else {
            return Promise.resolve(null);
        }
    });

    return Features.Transactions._prepareTransaction(playMock)
        .then(transactionData => {
            t.is(transactionData.fromUser, playerUser);
            t.not(transactionData.toUser, null);
            t.is(transactionData.toUser, artistUser);
            t.is(transactionData.amount, Config.appDefaults.defaultPricePerPlay);
        });
});

test.serial('_prepareTransaction - no priceperplay', t => {
    const playerUser = new UserModel({_id: 1, sc_id: 1});
    const artistUser = new UserModel({_id: 2, sc_id: 2});

    const playMock = new HistoryPlayModel({
        _id: "play_id",
        player: {
            sc_id: playerUser.sc_id
        },
        artist: {
            sc_id: artistUser.sc_id
        },
        track: {
            id: 3
        }
    });

    sandbox.stub(DBModels.Users, "getById", function(id, field) {
        t.is(field, "sc_id");
        if(id === 1) {
            return Promise.resolve(playerUser);
        } else {
            return Promise.resolve(artistUser);
        }
    });

    return Features.Transactions._prepareTransaction(playMock)
        .then(transactionData => {
            t.is(transactionData.fromUser, playerUser);
            t.is(transactionData.toUser, artistUser);
            t.is(transactionData.amount, Config.appDefaults.defaultPricePerPlay);
        })
        .catch(err => t.fail(err.stack));
});

test.serial('_prepareTransaction', t => {
    const playerUser = new UserModel({
        _id: 1, sc_id: 1,
        config: {
            pricePerPlay: 10
        }
    });
    const artistUser = new UserModel({_id: 2, sc_id: 2});

    const playMock = new HistoryPlayModel({
        _id: "play_id",
        player: {
            sc_id: playerUser.sc_id
        },
        artist: {
            sc_id: artistUser.sc_id
        },
        track: {
            id: 3
        }
    });

    sandbox.stub(DBModels.Users, "getById", function(id, field) {
        t.is(field, "sc_id");
        if(id === 1) {
            return Promise.resolve(playerUser);
        } else {
            return Promise.resolve(artistUser);
        }
    });

    return Features.Transactions._prepareTransaction(playMock)
        .then(transactionData => {
            t.is(transactionData.fromUser, playerUser);
            t.is(transactionData.toUser, artistUser);
            t.is(transactionData.amount, playerUser.config.pricePerPlay);
        })
        .catch(err => t.fail(err.stack));
});


test.serial('_updateWallets', t => {
    const playerUser = new UserModel({_id: 1, sc_id: 1});
    const artistUser = new UserModel({_id: 2, sc_id: 2});

    const transactionData ={
        fromUser: playerUser,
        toUser: artistUser,
        amount: 10
    };

    sandbox.stub(Features.Wallet, "updateUserWallet", function({ user, addedBalance }) {
        if(user.sc_id === 1) {
            t.is(user, playerUser);
            t.is(addedBalance, -10);
        } else {
            t.is(user, artistUser);
            t.is(addedBalance, 10);
        }
        return Promise.resolve(null);
    });


    return Features.Transactions._updateWallets(transactionData)
        .then(transactionDataR => {
            t.is(transactionDataR, transactionData);
        })
        .catch(err => t.fail(err.stack));
});

test.serial('_assertAccountable - false', t => {
    const playerUser = new UserModel({_id: 1, sc_id: 1});
    const playerWallet = new WalletModel({_id: 1, balance: 5});

    const transactionData ={
        fromUser: playerUser,
        toUser: null,
        amount: 10
    };

    sandbox.stub(Features.Wallet, "getUserWallet", function(user) {
        t.is(user, playerUser);
        return Promise.resolve(playerWallet);
    });

    return Features.Transactions._assertAccountable(transactionData)
        .then(() => {
            t.fail();
        })
        .catch(err => t.is(err, "NOT_ACCOUNTABLE"));
});
test.serial('_assertAccountable - true', t => {
    const playerUser = new UserModel({_id: 1, sc_id: 1});
    const playerWallet = new WalletModel({_id: 1, balance: 15});

    const transactionData ={
        fromUser: playerUser,
        toUser: null,
        amount: 10
    };

    sandbox.stub(Features.Wallet, "getUserWallet", function(user) {
        t.is(user, playerUser);
        return Promise.resolve(playerWallet);
    });

    return Features.Transactions._assertAccountable(transactionData)
        .then(transactionDataR => {
            t.is(transactionDataR, transactionData);
        })
        .catch(err => t.fail(err.stack));
});
test.serial('_assertAccountable - true ==', t => {
    const playerUser = new UserModel({_id: 1, sc_id: 1});
    const playerWallet = new WalletModel({_id: 1, balance: 10});

    const transactionData ={
        fromUser: playerUser,
        toUser: null,
        amount: 10
    };

    sandbox.stub(Features.Wallet, "getUserWallet", function(user) {
        t.is(user, playerUser);
        return Promise.resolve(playerWallet);
    });

    return Features.Transactions._assertAccountable(transactionData)
        .then(transactionDataR => {
            t.is(transactionDataR, transactionData);
        })
        .catch(err => t.fail(err.stack));
});

test.serial('askPlayTransaction', t => {
    const playerUser = new UserModel({_id: 1, sc_id: 1});
    const artistUser = new UserModel({_id: 2, sc_id: 2});

    const playMock = new HistoryPlayModel({
        _id: "play_id",
        player: {
            sc_id: playerUser.sc_id
        },
        artist: {
            sc_id: artistUser.sc_id
        },
        track: {
            id: 3
        }
    });

    const transactionData ={
        fromUser: playerUser,
        toUser: artistUser,
        amount: 10
    };


    sandbox.stub(DBModels.Users, "getById", function(id, field) {
        t.is(field, "sc_id");
        if(id === 1) {
            return Promise.resolve(playerUser);
        } else {
            return Promise.resolve(artistUser);
        }
    });

    sandbox.stub(DBModels.Transactions, "insert", function(tr) {
        let inserted = new TransactionModel(tr);
        inserted._id = "1";

        return Promise.resolve(inserted);
    });

    sandbox.stub(Features.Transactions, "_prepareTransaction", function(hp) {
        t.is(hp, playMock);
        return Promise.resolve(transactionData);
    });
    sandbox.stub(Features.Transactions, "_assertAccountable", function(td) {
        t.is(td, transactionData);
        return Promise.resolve(transactionData);
    });
    sandbox.stub(Features.Transactions, "_updateWallets", function(td) {
        t.is(td, transactionData);
        return Promise.resolve(transactionData);
    });

    sandbox.stub(DBModels.HistoryPlays, "updateField", function(hp, field) {
        t.is(hp.transaction_id, "1");
        t.is(field, "transaction_id");
        return Promise.resolve(null);
    });

    return Features.Transactions.askPlayTransaction(playMock)
        .then(transaction => {
            t.is(transaction.from.sc_id, playMock.player.sc_id);
            t.is(transaction.to.sc_id, playMock.artist.sc_id);
            t.is(transaction.track.id, playMock.track.id);
            t.is(transaction.amount, 10);
            t.is(transaction.play_id, playMock._id);
        })
        .catch(err => t.fail(err.stack));
});


test.serial('askPlayTransaction - not enough moneyyy', t => {
    const playerUser = new UserModel({_id: 1, sc_id: 1});
    const artistUser = new UserModel({_id: 2, sc_id: 2});

    const playMock = new HistoryPlayModel({
        _id: "play_id",
        player: {
            sc_id: playerUser.sc_id
        },
        artist: {
            sc_id: artistUser.sc_id
        },
        track: {
            id: 3
        }
    });

    const transactionData ={
        fromUser: playerUser,
        toUser: artistUser,
        amount: 10
    };


    sandbox.stub(DBModels.Users, "getById", function(id, field) {
        t.is(field, "sc_id");
        if(id === 1) {
            return Promise.resolve(playerUser);
        } else {
            return Promise.resolve(artistUser);
        }
    });

    sandbox.stub(Features.Transactions, "_prepareTransaction", function(hp) {
        t.is(hp, playMock);
        return Promise.resolve(transactionData);
    });
    sandbox.stub(Features.Transactions, "_assertAccountable", function(td) {
        t.is(td, transactionData);
        return Promise.reject("NOT_ACCOUNTABLE");
    });

    return Features.Transactions.askPlayTransaction(playMock)
        .then(result => {
            t.is(result, false);
        })
        .catch(err => t.fail(err.stack));
});