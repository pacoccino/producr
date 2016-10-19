const DBWrapper = require('./wrappers').DB;
const UserModel = require('../../common/models/SoundCloudUser');

function Users() {
    this.users = {};
}

Users.prototype.create = function(user) {
    user = new UserModel(user);
    user = user.toJS();

    return DBWrapper.collections.Users.insert(user)
        .then(results => {
            return new UserModel(results.ops[0]);
        });
};
Users.prototype.update = function(user) {
    const jsUser = user.toJS();

    return DBWrapper.collections.Users
        .updateOne({sc_id: user.sc_id}, jsUser)
        .then((updated) => {
            return new UserModel(user);
        });
};
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
        console.log("getById");
        DBWrapper.collections.Users.findOne({sc_id: userId})
            .then(user => {
                user = user ? new UserModel(user) : null;
                console.log("user", user);
                resolve(user);
            }).catch(reject);
    });
};

module.exports = new Users();
