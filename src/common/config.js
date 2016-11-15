var defaultConfig = require('../config.json');

var Config = {
    port: process.env.PORT || defaultConfig.port,
    environment: process.env.ENV || defaultConfig.environment || "dev",
    staticFolder: defaultConfig.staticFolder,
    host: process.env.HOST || defaultConfig.host,
    rollbarToken: process.env.ROLLBAR || defaultConfig.rollbarToken || null
};

Config.host = getHost(Config);

Config.services = {
    soundcloud: {
        client_id: process.env.SC_CLIENT_ID || defaultConfig.services.soundcloud.client_id,
        client_secret: process.env.SC_CLIENT_SECRET || defaultConfig.services.soundcloud.client_secret
    }
};

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

Config.appDefaults = defaultConfig.appDefaults;

module.exports = Config;

function getHost(c) {
    if(c.host) {
        return c.host;
    } else {
        let host = "http://localhost:";
        host += c.port;
        return host;
    }
}