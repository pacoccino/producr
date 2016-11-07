const ClassModel = require('./classModel');

class SoundCloudUser extends ClassModel {

    _getProperties() {
        return {
            _id: null,

            balance: 0,
            user_id: null
        };
    }
}


module.exports = SoundCloudUser;