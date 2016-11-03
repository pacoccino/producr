import test from 'ava';
import sinon from 'sinon';

import DBModel from '../../src/server/modules/dbModels/dbModel';
import DBModels from '../../src/server/modules/dbModels';
import Wallet from '../../src/server/modules/features/wallet';

import UserModel from '../../src/common/models/SoundCloudUser';
import WalletModel from '../../src/common/models/Wallet';

DBModels.Wallets = new DBModel();
DBModels.Users = new DBModel();

const mockUser = new UserModel();

var sandbox;
test.beforeEach(function () {
    sandbox = sinon.sandbox.create();
});
test.afterEach(function () {
    sandbox.restore();
});

test.serial('createUserWallet', t => {

    sandbox.stub(DBModels.Wallets, "insert", function() {
        return Promise.resolve(new WalletModel({_id: "wallet_id"}));
    });
    sandbox.stub(DBModels.Users, "updateField", function(user, field) {
        t.is(user.wallet_id, "wallet_id");
        t.is(field, "wallet_id");
        return Promise.resolve(new UserModel());
    });

    return Wallet.createUserWallet(mockUser)
        .then(wallet => {
            t.is(wallet._id, "wallet_id");
            t.is(wallet.balance, 0);
            // t.is(mockUser.wallet_id, "wallet_id"); // TODO
        });
});

test.serial('getUserWallet - without wallet', t => {

    const tUser = mockUser.set("wallet_id", null);

    sandbox.stub(Wallet, "createUserWallet", function() {
        return Promise.resolve(new WalletModel({_id: "wallet_id"}));
    });

    return Wallet.getUserWallet(tUser)
        .then(wallet => {
            t.is(wallet._id, "wallet_id");
            t.is(wallet.balance, 0);
        });
});

test.serial('getUserWallet - with wallet', t => {

    const tUser = mockUser.set("wallet_id", "wallet_id");

    sandbox.stub(DBModels.Wallets, "getById", function(id) {
        return Promise.resolve(new WalletModel({_id: id, balance: 15}));
    });

    return Wallet.getUserWallet(tUser)
        .then(wallet => {
            t.is(wallet._id, "wallet_id");
            t.is(wallet.balance, 15);
        });
});

test.serial('getUserWallet - with missing wallet', t => {

    const tUser = mockUser.set("wallet_id", "wallet_id");

    sandbox.stub(DBModels.Wallets, "getById", function() {
        return Promise.resolve(null);
    });

    return Wallet.getUserWallet(tUser)
        .then(() => t.fail())
        .catch(() => t.pass());
});

test.serial('updateUserWallet', t => {

    sandbox.stub(Wallet, "getUserWallet", function() {
        return Promise.resolve(new WalletModel({_id: "wallet_id"}));
    });
    sandbox.stub(DBModels.Wallets, "incField", function(wallet, inc) {
        return Promise.resolve(new WalletModel({_id: wallet._id, balance: wallet.balance + inc.balance}));
    });


    return Wallet.updateUserWallet({ user: mockUser, addedBalance: 10 })
        .then(wallet => {
            t.is(wallet.balance, 10);
        });
});

test.serial('updateUserWallet - missing', t => {

    sandbox.stub(Wallet, "getUserWallet", function() {
        return Promise.resolve(null);
    });

    return Wallet.updateUserWallet({ user: mockUser, addedBalance: 10 })
        .then(() => t.fail())
        .catch(() => t.pass());
});
