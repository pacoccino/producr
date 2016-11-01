const _ = require('lodash');

const SoundcloudResource = require('../../soundcloud/index').Resource;
const SoundCloud = require('../../soundcloud/index');
const DBModels = require('../dbModels');

const ListenedStates = {
    LISTENING: 'LISTENING',
    LISTENED: 'LISTENED',
    SKIPPED: 'SKIPPED'
};
const ListenedTimes = {
    SKIP: 10
};

// TODO :
// - get song duration and compare with play duration to better validate
// get more than 9 last from soundcloud API
// check if last returned is already stored, if not ask for next

const History = {

    computeDiff: (history) => {
        return history.map((play, index) => {
            let diff = null;
            if(index !== 0) {
                let lastPlayed = history[index-1].played_at;
                diff = lastPlayed - play.played_at;
                diff = Math.floor(diff/1000);
            }
            play.played_duration = diff;
            return play;
        });
    },
    getListenedState: (play) => {
        const diff = play.played_duration;
        if(_.isNil(diff)) {
            return ListenedStates.LISTENING;
        } else if(diff < ListenedTimes.SKIP) {
            return ListenedStates.SKIPPED;
        } else {
            return ListenedStates.LISTENED;
        }
    },
    setListenedState: (history) => {
        return history
            .map(play => {
                play.played_state = History.getListenedState(play);
                return play;
            });
    },
    convertPlayToModel: (user) => (play) => {
        let historyTrack = {
            track_id: play.track_id,
            permalink_url: play.track.permalink_url,
            played_by_sc_id: user.sc_id,
            played_at: play.played_at,
            played_duration: play.played_duration,
            played_state: play.played_state,
            artist: play.track.user.username,
            title: play.track.title
        };

        // Convert to model optional (dbmodel does it at insert
        return DBModels.PlaysHistory._model(historyTrack);
    },
    updateUserHistory: (user) => {
        const updateData = {
            lastFetched: user.crawlers && user.crawlers.lastHistoryFetch || 0
        };

        var resourceObject = new SoundcloudResource(user.sc_auth.access_token);
        resourceObject.me();
        resourceObject.playHistory();
        resourceObject.get();

        return SoundCloud.askResource(resourceObject)
            .then(resource => {
                updateData.newHistory = resource.collection;
                if(!updateData.newHistory.length) return;

                updateData.newHistory = History.computeDiff(updateData.newHistory);

                // On retire le premier element, car on ne connait pas sa durée, mais on le recupere la prochaine fois
                updateData.newHistory.shift();

                // On ne garde que les nouvelles lectures
                updateData.newHistory = updateData.newHistory.filter(play => play.played_at > updateData.lastFetched);

                updateData.newHistory = History.setListenedState(updateData.newHistory);

                // Convertion dans le modele data
                updateData.newHistory = updateData.newHistory.map(History.convertPlayToModel(user));
            })
            .then(() => {
                if(updateData.newHistory.length) {
                    return DBModels.PlaysHistory.insertMultiple(updateData.newHistory)
                        .then(insertedHistory => {
                            const lastTrackAdded = updateData.newHistory[0];

                            // On prend la date du dernier historique conservé pour fetch plus tard
                            const userCrawlerData = user.crawlers || {};
                            userCrawlerData.lastHistoryFetch = lastTrackAdded.played_at;

                            user = user.set('crawlers', userCrawlerData);
                            return DBModels.Users.updateField(user, 'crawlers');
                        });
                }
            })
            .then(() => {
                return {
                    nbAdded: updateData.newHistory.length
                }
            });
    },

    getUserHistory: ({ user, params }) => {
        params = params || {};
        const options = {
            limit: params.limit || 10,
            skip: params.skip || 0,
            sort: { played_at: -1 }
        };
        const query = {
            played_by_sc_id: user.sc_id
        };
        const userHistory = {
            sc_id: user.sc_id,
            lastFetched: user.crawlers && user.crawlers.lastHistoryFetch || 0,
            history: []
        };

        return DBModels.PlaysHistory.find(query, options)
            .then(historyPlays => {
                userHistory.history = historyPlays;
                return userHistory;
            });
    }
};

History.ListenedStates = ListenedStates;
History.ListenedTimes = ListenedTimes;

module.exports = History;