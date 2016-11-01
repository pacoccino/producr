const DBWrapper = require('../wrappers').DB;

const DBModel = require('./dbModel');

const HistoryPlayModel = require('../../../common/models/HistoryPlay');
const TransactionModel = require('../../../common/models/Transaction');
const UserModel = require('../../../common/models/SoundCloudUser');
const WalletModel = require('../../../common/models/Wallet');

const DBModels = {};

DBModels.initialize = () => {
    const hystoryPlaysCollection = DBWrapper.collections.HistoryPlays;
    const transactionCollection = DBWrapper.collections.Transactions;
    const userCollection = DBWrapper.collections.Users;
    const walletCollection = DBWrapper.collections.Wallets;

    DBModels.HistoryPlays = new DBModel(HistoryPlayModel, hystoryPlaysCollection);
    DBModels.Transactions = new DBModel(TransactionModel, transactionCollection);
    DBModels.Users = new DBModel(UserModel, userCollection);
    DBModels.Wallets = new DBModel(WalletModel, walletCollection);
};


module.exports = DBModels;