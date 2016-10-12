const Redis = require('./connections').redis;

const serializer = JSON.stringify;
const deserializer = JSON.parse;

const CacheWrapper = {
    get: (path) => {
        return new Promise((resolve, reject) => {
            Redis.get(path, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    try {
                        const deserialized = deserializer(data);
                        resolve(deserialized);
                    } catch(e) {
                        reject(e);
                    }
                }
            });
        });
    },

    set: (path, data) => {
        return new Promise((resolve, reject) => {
            try {
                const serialized = serializer(data);
                Redis.set(path, serialized, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    },

    delete: (path) => {
        return new Promise((resolve, reject) => {
            Redis.del(path, (err) => {
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