const DBWrapper = require('../wrappers').DB;

const DBModel = require('./dbModel');

const HistoryTrackModel = require('../../../common/models/HistoryTrack');
const TransactionModel = require('../../../common/models/Transaction');
const UserModel = require('../../../common/models/SoundCloudUser');
const WalletModel = require('../../../common/models/Wallet');

const DBModels = {};

DBModels.initialize = () => {
    const playsHistoryCollection = DBWrapper.collections.PlaysHistory;
    const transactionCollection = DBWrapper.collections.Transactions;
    const userCollection = DBWrapper.collections.Users;
    const walletCollection = DBWrapper.collections.Wallets;

    DBModels.PlaysHistory = new DBModel(HistoryTrackModel, playsHistoryCollection);
    DBModels.Transactions = new DBModel(TransactionModel, transactionCollection);
    DBModels.Users = new DBModel(UserModel, userCollection);
    DBModels.Wallets = new DBModel(WalletModel, walletCollection);
};


module.exports = DBModels;