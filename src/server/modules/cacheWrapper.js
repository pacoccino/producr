const serializer = JSON.stringify;
const deserializer = JSON.parse;

const CacheWrapper = {
    get: (path) => {
        return new Promise((resolve, reject) => {
            CacheWrapper._redis.get(path, (err, data) => {
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
                CacheWrapper._redis.set(path, serialized, (err) => {
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
            CacheWrapper._redis.del(path, (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }
};

CacheWrapper.initialize = (client) => {
    CacheWrapper._redis = client;
};

module.exports = CacheWrapper;