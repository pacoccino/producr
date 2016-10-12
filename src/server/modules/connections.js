const Connections = {};

Connections.initialize = () => new Promise((resolve, reject) => {

    const options = {
        host: 'localhost',
        port: 32774
    };
    var redis = require("redis"),
        redisClient = redis.createClient(options);


    redisClient.on("error", function (err) {
        console.log("Redis Error " + err);
    });

    Connections.redis = redisClient;

    redisClient.on('ready', () => {
        resolve();
    });
});

module.exports = Connections;