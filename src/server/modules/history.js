const _ = require('lodash');
const Immutable = require('immutable');

const ResourceObject = require('../connectors/soundcloudResource');
const SoundCloud = require('../connectors/soundcloud');
const DBWrapper = require('./wrappers').DB;

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
// - last listened, compare with now and duration

const History = {

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
                play.set('listenedState',
                    History.getListenedState(play.get('played_duration'))))
            .toJS();
    },

    updateUserHistoryDatabase: (user) => {
        return new Promise((resolve, reject) => {
            const fetchTime = Date.now();

            var resourceObject = new ResourceObject(user.token);
            resourceObject.recentlyPlayed();
            resourceObject.tracks();
            resourceObject.get();

            SoundCloud.askResource(resourceObject)
                .then(resource => {
                    let newHistory = resource.collection;

                    DBWrapper.collections.UserHistory
                        .find({userId: user.id}, {lastFetched: 1})
                        .next()
                        .then(userHistory => {
                            const lastFetched = userHistory && userHistory.lastFetched || 0;

                            newHistory = History.computeDiff(newHistory);
                            newHistory = History.setListenedState(newHistory);
                            newHistory = newHistory.filter(play => play.played_at > lastFetched);

                            if(userHistory) {

                                DBWrapper.collections.UserHistory
                                    .updateOne({userId: user.id}, {
                                        '$set': {
                                            lastFetched: fetchTime,
                                        },
                                        '$push': {
                                            'history': {
                                                '$each': newHistory,
                                                '$position': 0,
                                            }
                                        }
                                    })
                                    .then(resolve, reject);
                            } else {

                                DBWrapper.collections.UserHistory
                                    .insert({
                                        userId: user.id,
                                        lastFetched: fetchTime,
                                        history: newHistory
                                    })
                                    .then(resolve, reject);
                            }
                        });
                });
        });

    },

    upAndReturn: (user) => {
        return new Promise((resolve, reject) => {
            History.updateUserHistoryDatabase(user)
                .then(() => {
                    DBWrapper.collections.UserHistory
                        .find({userId: user.id})
                        .toArray()
                        .then(resolve, reject);
                })
                .catch(reject);
        });
    }

};

History.ListenedStates = ListenedStates;
History.ListenedTimes = ListenedTimes;

module.exports = History;