const DBWrapper = {};

DBWrapper.initialize = (client) => {
    DBWrapper._mongo = client;
    DBWrapper.collections = {
        PlaysHistory: client.collection('PlaysHistory'),
        Transactions: client.collection('Transactions'),
        Users: client.collection('Users'),
        Wallets: client.collection('Wallets'),
    };
};

module.exports = DBWrapper;