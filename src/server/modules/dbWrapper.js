const DBWrapper = {};

DBWrapper.initialize = (client) => {
    DBWrapper._mongo = client;
    DBWrapper.collections = {
        UserHistory: client.collection('UserHistory')
    };
};

module.exports = DBWrapper;