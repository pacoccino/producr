const DBWrapper = require('./wrappers').DB;
const UserModel = require('../../common/models/SoundCloudUser');

function Users() {
}

Users.prototype.Model = UserModel;

Users.prototype.create = function(user) {
    user = new UserModel(user);
    user = user.toJS();

    return DBWrapper.collections.Users.insert(user)
        .then(results => {
            return new Users.Model(results.ops[0]);
        });
};
Users.prototype.update = function(user) {
    const jsUser = user.toJS();

    return DBWrapper.collections.Users
        .updateOne({sc_id: user.sc_id}, jsUser)
        .then(() => {
            return new Users.Model(user);
        });
};

// TODO
/*
Users.prototype.delete = function(userId) {
    return new Promise((resolve, reject) => {
        if(!userId) reject("Delete user error: no userId provided");

        CacheWrapper.delete(USR_PREFIX + userId)
            .then(resolve, reject);
    });
};*/

Users.prototype.getById = function(userId) {
    return new Promise((resolve, reject) => {
        DBWrapper.collections.Users.findOne({sc_id: userId})
            .then(user => {
                user = user ? new Users.Model(user) : null;
                resolve(user);
            }).catch(reject);
    });
};

module.exports = new Users();
