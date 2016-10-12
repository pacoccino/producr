const UserModel = require('../models/user');

function Users() {
    this.users = {};
}

Users.prototype.create = function(userId) {
    return new Promise(resolve => {
        const user = new UserModel(userId);

        this.users[userId] = user;

        resolve(user);
    });
};

Users.prototype.delete = function(userId, cb) {
    if(!userId) return;

    delete this.users[userId];

    cb(null);
};

Users.prototype.getById = function(userId) {
    return new Promise((resolve, reject) => {
        const user = this.users[userId];

        if(user) {
            resolve(user);
        } else {
            reject(user);
        }
    });
};

Users.prototype.findOrCreate = function(userId) {
    return new Promise((resolve, reject) => {
        this.getById(userId)
            .then(resolve, () => {
                this.create(userId)
                    .then(resolve);
            });
    });
};

module.exports = new Users();
