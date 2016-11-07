const ClassModel = require('./classModel');

class SoundCloudUser extends ClassModel {

    _getProperties() {
        return {
            _id: null,

            sc_id: null,
            sc_auth: null,
            sc_profile: null,

            wallet_id: null,
            crawlers: null,
            config: null
        };
    }

    toClient() {
        const jsUser = this.toJS();
        return jsUser.sc_profile;
    }
}


module.exports = SoundCloudUser;