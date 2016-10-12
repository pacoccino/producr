const Connections = require('./connections');
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
        Connections.redis.set(USR_PREFIX + user.id, JSON.stringify(user), (err) => {
            if(err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

Users.prototype.delete = function(userId) {
    return new Promise((resolve, reject) => {
        if(!userId) reject("Delete user error: no userId provided");

        Connections.redis.remove(USR_PREFIX + userId, err => {
            if(err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
};

Users.prototype.getById = function(userId) {
    return new Promise((resolve, reject) => {
        Connections.redis.get(USR_PREFIX + userId, function(err, user) {
            if(err) {
                reject(err);
            } else {
                if(user) {
                    resolve(JSON.parse(user));
                } else {
                    resolve(null);
                }
            }
        });
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
