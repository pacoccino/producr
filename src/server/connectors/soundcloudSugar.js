const moment = require('moment');

const ResourceObject = require('./soundcloudResource');

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
                    history = history.map(play => {
                        play.date = moment(new Date(play.played_at)).format();
                        play.name = play.urn;
                        var trackResource = ResourceObject.fromUrn(play.urn);
                        SoundCloud.askResource(trackResource)
                            .then((track) => {
                                play.name = trackResource.resourceId + ': ' + track.title + ' - ' + track.user.username;
                            })
                            .catch((err) => {
                                play.name = trackResource.resourceId + ' (Unkonwn)';
                            });
                        return play;
                    });
                    setTimeout(() => {
                        resolve(history);
                    }, 1000)
                })
                .catch(err => {
                    reject(err);
                });
        }),
        
        getSong: (songId) => new Promise((resolve, reject) => {
            
        })
    };
};

module.exports = SoundCloudSugar;