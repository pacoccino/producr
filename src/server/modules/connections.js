const Redis = require("redis");
const MongoClient = require('mongodb').MongoClient;

const Wrappers = require('./wrappers');
const DBModels = require('./dbModels');
const Config = require('./config');

const Connections = {};

Connections.initialize = () => new Promise((resolve, reject) => {

    const connectionPromises = [];

    // Redis
    const options = {
        host: Config.connections.redis.host,
        port: Config.connections.redis.port
    };
    const redisClient = Redis.createClient(options);
    redisClient.on("error", function (err) {
        console.log("Redis Error " + err);
    });

    connectionPromises.push(new Promise((res) => {
        redisClient.on('ready', () => {
            console.info("Redis connected");

            Connections.redis = redisClient;
            Wrappers.Cache.initialize(redisClient);

            res();
        });
    }));


    // Mongo
    var url = Config.connections.mongoUrl;
    connectionPromises.push(new Promise((res,rej) => {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                rej(err);
            } else {
                console.info("Mongo connected");

                Connections.mongo = db;
                Wrappers.DB.initialize(db);
                DBModels.initialize();

                res();
            }
        });
    }));

    Promise.all(connectionPromises).then(resolve, reject);
});

module.exports = Connections;