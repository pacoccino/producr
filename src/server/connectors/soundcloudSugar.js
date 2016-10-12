const moment = require('moment');

const ResourceObject = require('../modules/resourceObject');

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
                        return play;
                    });
                    resolve(history);
                })
                .catch(err => {
                    reject(err);
                });
        })
    };
};

module.exports = SoundCloudSugar;