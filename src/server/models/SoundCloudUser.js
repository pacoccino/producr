const Record = require('immutable/record');

const ServiceAuthentication = require('./ServiceAuthentication');

const SoundCloudUser = new Record({
    id: null,
    auth: new ServiceAuthentication(),
    sc_profile: null
});

module.exports = SoundCloudUser;