const DBWrapper = require('../wrappers').DB;
const DBModel = require('./dbModel');
const UserModel = require('../../../common/models/SoundCloudUser');
const WalletModel = require('../../../common/models/Wallet');

const DBModels = {};

DBModels.initialize = () => {
    const userCollection = DBWrapper.collections.Users;
    const walletCollection = DBWrapper.collections.Wallets;

    DBModels.Users = new DBModel(UserModel, userCollection);
    DBModels.Wallets = new DBModel(WalletModel, walletCollection);
};


module.exports = DBModels;