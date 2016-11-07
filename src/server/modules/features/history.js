const _ = require('lodash');
const async = require('async');

const SoundCloud = require('../../soundcloud/index');
const SoundCloudSugar = SoundCloud.Sugar;
const DBModels = require('../dbModels');
const Transactions = require('./transactions');
const HistoryPlay = require('../../../common/classModels/HistoryPlay');
const Users = require('./users');

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
                    Transactions.askPlayTransaction(historyPlay)
                        // history play with transaction id not updated cause of immutable
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
            const userToken = updateData.user.sc_auth.access_token;

            const getOptions = {
                limit: 50
            };

            const historyCursor = SoundCloudSugar.getPaginatedHistory(userToken, getOptions);
            const nextP = () => {
                historyCursor.next()
                    .then(history => {
                        if(history) {
                            updateData.newHistory = updateData.newHistory.concat(history);

                            const lastElement = history[history.length - 1];
                            if(lastElement.played_at > lastFetched) {
                                nextP();
                            } else {
                                resolve();
                            }
                        } else {
                            resolve();
                        }
                    }).catch(reject);
            };
            nextP();
        });
    },
    updateUserHistory: (user) => {
        const updateData = {
            user: user,
            lastFetched: user.crawlers && user.crawlers.lastHistoryFetch || 0,
            newHistory: []
        };

        return History._getNewUserHistory(updateData)
            /*// TODO refactor this to be used elsewhere
            .catch(error => {
                if(error.code === 401) {
                    return Users.tryToRefreshUser(user)
                        .then(token => {
                            resourceObject.updateToken(token);
                            return SoundCloud.askResource(resourceObject);
                        });
                } else {
                    throw error;
                }
            })*/
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

                            return Promise.all([
                                DBModels.Users.updateField(user, 'crawlers'),
                                History.askForTransactions({ user, plays: insertedHistory })
                            ]);
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
    }
};

module.exports = History;