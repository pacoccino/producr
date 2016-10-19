const ObjectId = require('bson').ObjectId;
const Record = require('immutable').Record;

const SoundCloudUser = new Record({
    _id: new ObjectId(),
    sc_id: null,
    sc_auth: null,
    sc_profile: null,
    wallet_id: null
}, 'SoundCloudUser');

SoundCloudUser.prototype.toClient = function() {
    let user = this.toJS();
    let scProfile = user.sc_profile;
    return scProfile;
};

module.exports = SoundCloudUser;