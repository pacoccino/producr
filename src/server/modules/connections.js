const Redis = require("redis");
const MongoClient = require('mongodb').MongoClient;

const Wrappers = require('./wrappers');
const Connections = {};

Connections.initialize = () => new Promise((resolve, reject) => {

    const connectionPromises = [];

    // Redis
    const options = {
        host: 'localhost',
        port: 32774
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
    var url = 'mongodb://localhost:32775/producr';
    connectionPromises.push(new Promise((res,rej) => {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                rej(err);
            } else {
                console.info("Mongo connected");

                Connections.mongo = db;
                Wrappers.DB.initialize(db);

                res();
            }
        });
    }));

    Promise.all(connectionPromises).then(resolve, reject);
});

module.exports = Connections;