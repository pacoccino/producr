const Record = require('immutable').Record;

const ServiceAuthentication = new Record({
    access_token: null,
    refresh_token: null,
    expiration: null
}, 'ServiceAuthentication');

module.exports = ServiceAuthentication;