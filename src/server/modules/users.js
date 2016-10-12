const CacheWrapper = require('./wrappers').Cache;
const UserModel = require('../models/user');

function Users() {
    this.users = {};
}

const USR_PREFIX = 'usr:';

Users.prototype.create = function(userId) {
    return new Promise(resolve => {
        const user = new UserModel(userId);

        this.updateUser(userId, user).then(resolve);
    });
};

Users.prototype.updateUser = function(userId, user) {
    return new Promise((resolve, reject) => {
        CacheWrapper.set(USR_PREFIX + userId, user)
            .then(resolve, reject);
    });
};

Users.prototype.delete = function(userId) {
    return new Promise((resolve, reject) => {
        if(!userId) reject("Delete user error: no userId provided");

        CacheWrapper.delete(USR_PREFIX + userId)
            .then(resolve, reject);
    });
};

Users.prototype.getById = function(userId) {
    return new Promise((resolve, reject) => {
        CacheWrapper.get(USR_PREFIX + userId)
            .then(user => { resolve(user || null); }).catch(reject);
    });
};

Users.prototype.findOrCreate = function(userId) {
    return new Promise((resolve, reject) => {
        this.getById(userId)
            .then(user => {
                if(user) {
                    resolve(user)
                } else {
                    this.create(userId)
                        .then(resolve);
                }
            })
            .catch(reject);
    });
};

module.exports = new Users();
