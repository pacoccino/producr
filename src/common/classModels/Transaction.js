const ClassModel = require('./classModel');

class SoundCloudUser extends ClassModel {

    _getProperties() {
        return {
            _id: null,
            date: null,

            from: null,
            to: null,
            track: null,

            amount: 0,
            play_id: null,
        };
    }
}


module.exports = SoundCloudUser;