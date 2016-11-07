const _ = require('lodash');
const async = require('async');

const SoundCloud = require('../../soundcloud/index');
const SoundCloudSugar = SoundCloud.Sugar;
const DBModels = require('../dbModels');
const HistoryPlay = require('../../../common/classModels/HistoryPlay');
const Features = require('./index');

const History = {

    computeDiff: (history) => {
        // We compute played_duration from difference between two played_at

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
    setListenedState: (history) => {
        return history
            .map(play => {
                play.played_state = play.getListenedState();
                return play;
            });
    },
    askForTransactions: ({ user, plays }) => {
        return new Promise((resolve, reject) => {
            async.map(plays, (historyPlay, callback) => {

                if(historyPlay.played_state === HistoryPlay.ListenedStates.LISTENED) {
                    Features.Transactions.askPlayTransaction(historyPlay)
                        .then(transaction => callback(null, historyPlay))
                        .catch(callback);
                } else {
                    callback(null, historyPlay)
                }
            }, (err, transactedPlays) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(transactedPlays);
                }
            });
        });
    },

    convertPlayToModel: (user) => (play) => {
        let historyTrack = {
            track: {
                id: play.track.id,
                title: play.track.title,
                permalink_url: play.track.permalink_url,
            },
            artist: {
                sc_id: play.track.user.id,
                username: play.track.user.username,
            },
            player: {
                sc_id: user.sc_id,
                username: user.sc_profile.username,
            },
            played_at: play.played_at,
            played_duration: play.played_duration,
            played_state: play.played_state,

            transaction_id: null
        };

        return new HistoryPlay(historyTrack);
    },

    _getNewUserHistory: (updateData) => {
        return new Promise((resolve, reject) => {
            const lastFetched = updateData.lastFetched;
            let userToken = updateData.user.sc_auth.access_token;

            const getOptions = {
                limit: 50
            };

            let historyCursor = SoundCloudSugar.getPaginatedHistory(userToken, getOptions);
            const next = () => {
                historyCursor.next()
                    .catch(error => {
                        if(error.code === 401) {
                            return Features.Users.refreshUserToken(updateData.user)
                                .then(token => {
                                    historyCursor.resourceObject.updateToken(token);
                                    return historyCursor.next();
                                });
                        } else {
                            throw error;
                        }
                    })
                    .then(history => {
                        if(history) {
                            updateData.newHistory = updateData.newHistory.concat(history);

                            const lastElement = history[history.length - 1];
                            if(lastElement.played_at > lastFetched) {
                                next();
                            } else {
                                resolve();
                            }
                        } else {
                            resolve();
                        }
                    }).catch(reject);
            };
            next();
        });
    },
    updateUserHistory: (user) => {
        if(user.crawlers && user.crawlers.historyFetching) {
            return Promise.reject({
                isFetching: true
            });
        }

        const updateData = {
            user: user,
            lastFetched: user.crawlers && user.crawlers.lastHistoryFetch || 0,
            newHistory: []
        };
        user.crawlers = user.crawlers || {};
        user.crawlers.historyFetching = true;
        const beforeHistoryFetchingUpdater = {
            "crawlers.historyFetching": true
        };
        return DBModels.Users.updateFields(user, beforeHistoryFetchingUpdater)
            .then(() => History._getNewUserHistory(updateData))
            .then(() => {
                if(!updateData.newHistory.length) return;

                updateData.newHistory = History.computeDiff(updateData.newHistory);

                // On retire le premier element, car on ne connait pas sa durée, mais on le recupere la prochaine fois
                updateData.newHistory.shift();

                // On ne garde que les nouvelles lectures
                updateData.newHistory = updateData.newHistory.filter(play => play.played_at > updateData.lastFetched);

                updateData.newHistory = updateData.newHistory.map(History.convertPlayToModel(user));
                updateData.newHistory = History.setListenedState(updateData.newHistory);
            })
            .then(() => {
                if(updateData.newHistory.length) {
                    return DBModels.HistoryPlays.insertMultiple(updateData.newHistory)
                        .then(insertedHistory => {
                            const lastTrackAdded = updateData.newHistory[0];

                            // On prend la date du dernier historique conservé pour fetch plus tard
                            user.crawlers = user.crawlers || {};
                            user.crawlers.lastHistoryFetch = lastTrackAdded.played_at;

                            const lastHistoryFetchUpdater = {
                                "crawlers.lastHistoryFetch": lastTrackAdded.played_at
                            };
                            return Promise.all([
                                DBModels.Users.updateFields(user, lastHistoryFetchUpdater),
                                History.askForTransactions({ user, plays: insertedHistory })
                            ]);
                        });
                }
            })
            .then(() => {
                user.crawlers = user.crawlers || {};
                user.crawlers.historyFetching = false;
                const afterHistoryFetchingUpdater = {
                    "crawlers.historyFetching": false
                };
                return DBModels.Users.updateFields(user, afterHistoryFetchingUpdater);
            })
            .then(() => {
                return {
                    nbAdded: updateData.newHistory.length
                }
            });
    },

    getUserHistory: (user, params) => {
        params = params || {};
        const options = {
            limit: params.limit || 10,
            skip: params.skip || 0,
            sort: { played_at: -1 }
        };
        const query = {
            "player.sc_id": user.sc_id
        };
        const userHistory = {
            sc_id: user.sc_id,
            lastFetched: user.crawlers && user.crawlers.lastHistoryFetch || 0,
            history: []
        };

        return DBModels.HistoryPlays.find(query, options)
            .then(historyPlays => {
                userHistory.history = historyPlays;
                return userHistory;
            });
    },
    _waitHistoryUpdated(user) {
        const checkDelay = 500;

        return new Promise((resolve, reject) => {
            const check = () => {
                Features.Users.getById(user._id).then(
                    freshUser => {
                        if(freshUser.crawlers && freshUser.crawlers.historyFetching) {
                            setTimeout(check, checkDelay);
                        } else {
                            resolve();
                        }
                    }
                ).catch(reject);
            };

            check();
        });
    }
};

module.exports = History;