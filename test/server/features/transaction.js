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

    sandbox.stub(DBModels.Users, "getById", function(id, field) {
        t.is(field, "sc_id");
        if(id === 1) {
            return Promise.resolve(playerUser);
        } else {
            return Promise.resolve(artistUser);
        }
    });

    sandbox.stub(Wallet, "updateUserWallet", function({ user, addedBalance }) {
        if(user.sc_id === 1) {
            t.is(addedBalance, -Config.appDefaults.defaultPricePerPlay);
        } else {
            t.is(addedBalance, Config.appDefaults.defaultPricePerPlay);
        }
        return Promise.resolve(null);
    });
    sandbox.stub(DBModels.Transactions, "insert", function(tr) {
        let inserted = new TransactionModel(tr);
        inserted = inserted.set("_id", "1");

        return Promise.resolve(inserted);
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
            t.is(transaction.amount, Config.appDefaults.defaultPricePerPlay);
            t.is(transaction.playId, playMock._id);
        })
        .catch(err => t.fail(err.stack));
});