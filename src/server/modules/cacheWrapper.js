const Connections = require('./connections');

const CacheWrapper = {
    get: (path) => {
        return new Promise((resolve, reject) => {
            Connections.redis.get(path, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    },

    set: (path, data) => {
        return new Promise((resolve, reject) => {
            Connections.redis.set(path, JSON.stringify(data), (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },

    delete: (path) => {
        return new Promise((resolve, reject) => {
            Connections.redis.del(path, (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

module.exports = CacheWrapper;