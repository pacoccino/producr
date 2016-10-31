var defaultConfig = require('../../config.json');

var Config = {
    port: process.env.PORT || defaultConfig.port,
    environment: process.env.ENV || defaultConfig.environment || "dev",
    staticFolder: defaultConfig.staticFolder
};

Config.services = defaultConfig.services;

Config.connections = {
    mongoUrl: process.env.MONGO_URL || defaultConfig.connections.mongoUrl,
    redis: {
        host: process.env.REDIS_HOST || defaultConfig.connections.redis.host,
        port: process.env.REDIS_PORT || defaultConfig.connections.redis.port
    }
};

Config.ssl = {
    ca: null,
    cert: null,
    key: null
};

Config.jwt = {
    secret: process.env.JWT_SECRET || "jwtftw",
    expiration: 10*24*60*60 // expires in 10 days
};

module.exports = Config;
