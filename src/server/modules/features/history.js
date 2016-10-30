const _ = require('lodash');

const SoundcloudResource = require('../../soundcloud/index').Resource;
const SoundCloud = require('../../soundcloud/index');
const DBWrapper = require('./../wrappers/index').DB;

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
        return history
            .map(play => {
                play.played_state = History.getListenedState(play.played_duration);
                return play;
            });
    },

    updateUserHistory: (user, reset) => {
        let updateData = {
            fetchTime: Date.now()
        };

        var resourceObject = new SoundcloudResource(user.sc_auth.access_token);
        resourceObject.me();
        resourceObject.playHistory();
        resourceObject.get();

        return SoundCloud.askResource(resourceObject)
            .then(resource => { updateData.newHistory = resource.collection; })
            .then(() => DBWrapper.collections.UserHistory
                .find({sc_id: user.sc_id})
                .next()
            )
            .then(userHistory => {
                const lastFetched = userHistory && userHistory.lastFetched || 0;

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

    getUserHistory: ({ user, params }) => {
        params = params || {};
        const limit = params.limit || 10;
        const skip = params.skip || 0;

        const query = {
            sc_id: user.sc_id
        };

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
                return userHistoryFromDB;
            })
            .then(userHistory => {
                userHistory.history = userHistory.history.slice(skip, skip+limit);
                return userHistory
            });
    }
};

History.ListenedStates = ListenedStates;
History.ListenedTimes = ListenedTimes;

module.exports = History;