const ObjectId = require('bson').ObjectId;
const Record = require('immutable').Record;

const ServiceAuthentication = require('./ServiceAuthentication');

const SoundCloudUser = new Record({
    _id: new ObjectId(),
    sc_id: null,
    sc_auth: ServiceAuthentication(),
    sc_profile: null,
    wallet_id: null
}, 'SoundCloudUser');

module.exports = SoundCloudUser;