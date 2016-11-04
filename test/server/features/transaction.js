import test from 'ava';
import sinon from 'sinon';

import Config from '../../../src/server/modules/config';
import DBModel from '../../../src/server/modules/dbModels/dbModel';
import DBModels from '../../../src/server/modules/dbModels';
import Wallet from '../../../src/server/modules/features/wallet';
import Transactions from '../../../src/server/modules/features/transactions';

import HistoryPlayModel from '../../../src/common/models/HistoryPlay';
import TransactionModel from '../../../src/common/models/Transaction';
import UserModel from '../../../src/common/models/SoundCloudUser';

DBModels.Transactions = new DBModel();
DBModels.HistoryPlays = new DBModel();
DBModels.Users = new DBModel();

var sandbox;
test.beforeEach(function () {
    sandbox = sinon.sandbox.create();
});
test.afterEach(function () {
    sandbox.restore();
});

// TODO test if artist user doesnt exists
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

    sandbox.stub(DBModels.Users, "getById", function(id, field) {
        t.is(field, "sc_id");
        if(id === 1) {
            return Promise.resolve(playerUser);
        } else {
            return Promise.resolve(null);
        }
    });

    return Transactions._prepareTransaction(playMock)
        .then(transactionData => {
            t.is(transactionData.fromUser, playerUser);
            t.not(transactionData.toUser, null);
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

    return Transactions._prepareTransaction(playMock)
        .then(transactionData => {
            t.is(transactionData.fromUser, playerUser);
            t.is(transactionData.toUser, artistUser);
            t.is(transactionData.amount, Config.appDefaults.defaultPricePerPlay);
        })
        .catch(err => t.fail(err.stack));
});

test.serial('_prepareTransaction - priceperplay', t => {
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

    return Transactions._prepareTransaction(playMock)
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

    sandbox.stub(Wallet, "updateUserWallet", function({ user, addedBalance }) {
        if(user.sc_id === 1) {
            t.is(user, playerUser);
            t.is(addedBalance, -10);
        } else {
            t.is(user, artistUser);
            t.is(addedBalance, 10);
        }
        return Promise.resolve(null);
    });


    return Transactions._updateWallets(transactionData)
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
        inserted = inserted.set("_id", "1");

        return Promise.resolve(inserted);
    });

    sandbox.stub(Transactions, "_prepareTransaction", function(hp) {
        t.is(hp, playMock);
        return Promise.resolve(transactionData);
    });
    sandbox.stub(Transactions, "_updateWallets", function(td) {
        t.is(td, transactionData);
        return Promise.resolve(transactionData);
    });

    sandbox.stub(DBModels.HistoryPlays, "updateField", function(hp, field) {
        t.is(hp.transaction_id, "1");
        t.is(field, "transaction_id");
        return Promise.resolve(null);
    });

    return Transactions.askPlayTransaction(playMock)
        .then(transaction => {
            t.is(transaction.from.sc_id, playMock.player.sc_id);
            t.is(transaction.to.sc_id, playMock.artist.sc_id);
            t.is(transaction.track.id, playMock.track.id);
            t.is(transaction.amount, 10);
            t.is(transaction.playId, playMock._id);
        })
        .catch(err => t.fail(err.stack));
});