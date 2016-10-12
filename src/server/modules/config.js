var defaultConfig = require('../config.json');

var Config = {
    port: process.env.PORT || defaultConfig.port,
    staticFolder: defaultConfig.staticFolder
};

Config.services = defaultConfig.services;

Config.connections = {
    mongoUrl: defaultConfig.connections.mongoUrl,
    redis: defaultConfig.connections.redis
};

Config.ssl = {
    ca: null,
    cert: null,
    key: null
};

module.exports = Config;
