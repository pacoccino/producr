var defaultConfig = require('../config.json');

var Config = {
    port: process.env.PORT || defaultConfig.port,
    environment: process.env.ENV || defaultConfig.environment || "dev",
    staticFolder: defaultConfig.staticFolder || "build"
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

Config.jwtSecret = "jwtftw";

module.exports = Config;
