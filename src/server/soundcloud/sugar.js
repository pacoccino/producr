const moment = require('moment');
const async = require('async');

const ResourceObject = require('./resource');

const SoundCloudSugar = (SoundCloud) => {

    return {
        getProfile: (token) => new Promise((resolve, reject) => {
            var resourceObject = new ResourceObject(token);

            resourceObject.me();
            resourceObject.get();

            SoundCloud.askResource(resourceObject)
                .then(resolve)
                .catch(reject);
        }),

        getPaginatedHistory: (token, options) => {
            options = options || {};
            var resourceObject = new ResourceObject(token);

            resourceObject.me();
            resourceObject.playHistory();
            resourceObject.get();
            resourceObject.limit(options.limit);

            return SoundCloud.askPaginatedResource(resourceObject);
        },

        getUser: (userId) => {
            var resourceObject = new ResourceObject();
            resourceObject.users(userId);
            resourceObject.get();
            return SoundCloud.askResource(resourceObject);
        },
        getTrack: (trackId) => {
            var resourceObject = new ResourceObject();
            resourceObject.tracks(trackId);
            resourceObject.get();
            return SoundCloud.askResource(resourceObject);
        }
    };
};

module.exports = SoundCloudSugar;