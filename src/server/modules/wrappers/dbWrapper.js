const DBWrapper = {};

DBWrapper.initialize = (client) => {
    DBWrapper._mongo = client;
    DBWrapper.collections = {
        HistoryPlays: client.collection('HistoryPlays'),
        Transactions: client.collection('Transactions'),
        Users: client.collection('Users'),
        Wallets: client.collection('Wallets'),
    };
};

module.exports = DBWrapper;