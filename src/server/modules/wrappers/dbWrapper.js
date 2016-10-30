const DBWrapper = {};

DBWrapper.initialize = (client) => {
    DBWrapper._mongo = client;
    DBWrapper.collections = {
        Transactions: client.collection('Transactions'),
        UserHistory: client.collection('UserHistory'),
        Users: client.collection('Users'),
        Wallets: client.collection('Wallets'),
    };
};

module.exports = DBWrapper;