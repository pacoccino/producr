const Redis = require("redis");
const MongoClient = require('mongodb').MongoClient;

const Wrappers = require('./wrappers');
const DBModels = require('./dbModels');
const Config = require('./config');

const Connections = {};

const initIndexes = () => {
    const promises = [];

    promises.push(Connections.mongo.createIndex("Users", "sc_id", {
        v: 1, unique: true, name: "Users.SC_uniqueness"
    }));

    promises.push(Connections.mongo.createIndex("HistoryPlays",
        "player.sc_id",
        { name: "HistoryPlays.player" }
    ));

    promises.push(Connections.mongo.createIndex("Transactions",
        "from.sc_id",
        { name: "Transactions.fromUser" }
    ));

    promises.push(Connections.mongo.createIndex("Transactions",
        "to.sc_id",
        { name: "Transactions.toUser" }
    ));

    return Promise.all(promises);
};
const initMongo = () => {
    return new Promise((resolve, reject) => {

        var url = Config.connections.mongoUrl;

        MongoClient.connect(url, function(err, db) {
            if (err) {
                reject(err);
            } else {
                console.info("Mongo connected");

                Connections.mongo = db;
                Wrappers.DB.initialize(db);
                DBModels.initialize();

                initIndexes().then(resolve).catch(reject);
            }
        });
    })
};

const initRedis = () => {
    return new Promise((resolve, reject) => {

        const options = {
            host: Config.connections.redis.host,
            port: Config.connections.redis.port
        };
        const redisClient = Redis.createClient(options);

        const onError = (err) => {
            if(err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
                reject(err);
                redisClient.removeListener('error', onError);
            } else {
                console.log("Redis Error ", err);
            }
        };
        const onReady = () => {
            console.info("Redis connected");

            Connections.redis = redisClient;
            Wrappers.Cache.initialize(redisClient);

            redisClient.removeListener('ready', onReady);
            resolve();
        };

        redisClient.on("error", onError);
        redisClient.on('ready', onReady);
    })
};

Connections.initialize = () => new Promise((resolve, reject) => {

    const connectionPromises = [];
    connectionPromises.push(initMongo());
    connectionPromises.push(initRedis());

    Promise.all(connectionPromises).then(resolve, reject);
});

module.exports = Connections;