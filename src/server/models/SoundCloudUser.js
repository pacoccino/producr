const Record = require('immutable/record');

const ServiceAuthentication = require('./ServiceAuthentication');

const SoundCloudUser = new Record({
    _id: null,
    scId: null,
    auth: ServiceAuthentication(),
    sc_profile: null,
    walletId: null
}, 'SoundCloudUser');

module.exports = SoundCloudUser;