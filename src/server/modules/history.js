const _ = require('lodash');
const Immutable = require('immutable');
const moment = require('moment');
const async = require('async');

const SoundcloudResource = require('../soundcloud').Resource;
const SoundCloud = require('../soundcloud');
const DBWrapper = require('./wrappers').DB;

const HistoryTrack = require('../../common/models/HistoryTrack');

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

const History = {

    preprocessHistory: (history) => history.map(play => {
        var trackResource = SoundcloudResource.fromUrn(play.urn);
        play.songId = trackResource.resourceId;
        return play;
    }),
    computeDiff: (history) => {
        const imHistory = Immutable.fromJS(history);
        return imHistory.map((play, index) => {
            let diff = null;
            if(index !== 0) {
                let lastPlayed = imHistory.get(index-1).get('played_at');
                diff = lastPlayed - play.get('played_at');
                diff = Math.floor(diff/1000);
            }
            return play.set('played_duration', diff);
        }).toJS();
    },
    getListenedState: (diff) => {
        if(_.isNil(diff)) {
            return ListenedStates.LISTENING;
        } else if(diff < ListenedTimes.SKIP) {
            return ListenedStates.SKIPPED;
        } else {
            return ListenedStates.LISTENED;
        }
    },
    setListenedState: (history) => {
        return Immutable.fromJS(history)
            .map(play =>
                play.set('played_state',
                    History.getListenedState(play.get('played_duration'))))
            .toJS();
    },

    updateUserHistory: (user, reset) => {
        let updateData = {
            fetchTime: Date.now()
        };

        var resourceObject = new SoundcloudResource(user.sc_auth.access_token);
        resourceObject.recentlyPlayed();
        resourceObject.tracks();
        resourceObject.get();

        return SoundCloud.askResource(resourceObject)
            .then(resource => { updateData.newHistory = resource.collection; })
            .then(() => DBWrapper.collections.UserHistory
                .find({sc_id: user.sc_id})
                .next()
            )
            .then(userHistory => {
                const lastFetched = userHistory && userHistory.lastFetched || 0;

                updateData.newHistory = History.preprocessHistory(updateData.newHistory);
                updateData.newHistory = History.computeDiff(updateData.newHistory);
                updateData.newHistory = History.setListenedState(updateData.newHistory);

                if(reset) {
                    return updateData;
                }

                updateData.oldLastTrackFetched = updateData.newHistory.find(play => play.played_at <= lastFetched);

                updateData.newHistory = updateData.newHistory.filter(play => play.played_at > lastFetched);

                if(updateData.oldLastTrackFetched) {
                    updateData.newHistory = updateData.newHistory.concat(updateData.oldLastTrackFetched);
                }

                return updateData;
            })
            .then((updateData) => reset ?
                DBWrapper.collections.UserHistory.updateOne({sc_id: user.sc_id},
                    {
                        '$set': {
                            lastFetched: updateData.fetchTime,
                            history : updateData.newHistory
                        },
                    },
                    { upsert: true }
                )
                :
                DBWrapper.collections.UserHistory.updateOne(
                    {sc_id: user.sc_id},
                    {
                        '$set': { lastFetched: updateData.fetchTime },
                    },
                    { upsert: true })
                    .then(() => {
                        if(updateData.newHistory.length > 0 && updateData.oldLastTrackFetched) {
                            return DBWrapper.collections.UserHistory.updateOne({userId: user.id},
                                {
                                    '$pop': {
                                        'history': -1
                                    }
                                }
                            );
                        }

                    })
                    .then(() => {
                        if(updateData.newHistory.length > 0) {
                            return DBWrapper.collections.UserHistory.updateOne({userId: user.id},
                                {
                                    '$push': {
                                        'history': {
                                            '$each': updateData.newHistory,
                                            '$position': 0
                                        }
                                    }
                                }
                            )
                        }
                    })
            );
    },

    hydrateHistory: (history) => {

        const convertPlay = (track, play) => HistoryTrack({
                // ...play,

                urn: play.urn,
                songId: play.songId,
                played_at: play.played_at,
                played_duration: play.played_duration,
                played_state: play.played_state  || play.listenedState,

                url: track.permalink_url,
                artist: track.user.username,
                title: track.title
        });

        return new Promise((resolve, reject) => {
            async.map(history, (play, cb) => {
                var trackResource = SoundcloudResource.fromUrn(play.urn);
                SoundCloud.cachedResource(trackResource)
                    .then(track => {
                        const playTrack = convertPlay(track, play);
                        cb(null, playTrack.toJSON());
                    })
                    .catch(() => {
                        cb(null, play);
                    });
            }, (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    getUserHistory: ({ user, params }) => {
        params = params || {};
        const limit = params.limit || 10;
        const skip = params.skip || 0;

        const query = {
            sc_id: user.sc_id
        };

        const hydrate = params.hr;

        let userHistory = null;
        return DBWrapper.collections.UserHistory
            .findOne(query)
            .then(userHistoryFromDB => {

                if(!userHistoryFromDB) {
                    return {
                        sc_id: user.sc_id,
                        lastFetched: null,
                        history: []
                    };
                }
                userHistory = userHistoryFromDB;

                return hydrate ? History.hydrateHistory(userHistory.history) : userHistory.history;
            })
            .then(hydratedHistory => {
                userHistory.history = hydratedHistory;
                userHistory.history = userHistory.history.slice(skip, skip+limit);
                return userHistory
            })
            .then(userHistory => userHistory);
    }
};

History.ListenedStates = ListenedStates;
History.ListenedTimes = ListenedTimes;

module.exports = History;