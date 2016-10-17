const Record = require('immutable/record');

const ServiceAuthentication = new Record({
    access_token: null,
    refresh_token: null,
    expiration: null
}), 'ServiceAuthentication';

module.exports = ServiceAuthentication;