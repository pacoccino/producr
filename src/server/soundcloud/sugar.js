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

        getHistory: (token) => new Promise((resolve, reject) => {
            var resourceObject = new ResourceObject(token);

            resourceObject.recentlyPlayed();
            resourceObject.tracks();
            resourceObject.get();

            SoundCloud.askResource(resourceObject)
                .then(resource => {
                    var history = resource.collection;
                    async.map(history, (play, cb) => {
                        play.date = moment(new Date(play.played_at)).format();
                        play.name = play.urn;
                        var trackResource = ResourceObject.fromUrn(play.urn);
                        SoundCloud.cachedResource(trackResource)
                            .then((track) => {
                                play.name = trackResource.resourceId + ': ' + track.title + ' - ' + track.user.username;
                                cb(null, play);
                            })
                            .catch((err) => {
                                play.name = trackResource.resourceId + ': (Unkonwn)';
                                cb(null, play);
                            });
                    }, (err, results) => {
                        if(err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                })
                .catch(err => {
                    reject(err);
                });
        }),

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