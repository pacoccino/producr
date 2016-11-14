const DBModels = require('../dbModels');
const Config = require('../../../common/config');
const SoundCloud = require('../../soundcloud/index');
const Features = require('./index');

const Users = {

    getById: (_id) => {
        return DBModels.Users.getById(_id);
    },
    getByScId: (sc_id) => {
        return DBModels.Users.getById(sc_id, "sc_id");
    },

    newUserFromAuth: (sc_profile, sc_auth) => {
        const uts = {
            sc_id: sc_profile.id,
            sc_profile,
            sc_auth
        };
        return DBModels.Users.insert(uts)
            .then(user => Users.doFirstConnectionStuff(user));
    },

    updateUserFromAuth: (user, sc_profile, sc_auth) => {
        user.sc_profile =  sc_profile;
        user.sc_auth = sc_auth;

        const fields = {
            sc_profile,
            sc_auth
        };

        return DBModels.Users.updateFields(user, fields);
    },

    refreshUserToken: (user) => {
        const refreshToken = user.sc_auth.refresh_token;

        return SoundCloud.refreshToken(refreshToken)
            .catch(() => {
                delete user.sc_auth;
                return DBModels.Users.updateField(user, "sc_auth").then(() => {
                    throw "Corrupted user auth data";
                });
            })
            .then(sc_auth => {
                console.info("A user had to refresh his token.");
                user.sc_auth = {
                    access_token: sc_auth.access_token,
                    refresh_token: sc_auth.refresh_token,
                    type: "expiring"
                };
                return DBModels.Users.updateField(user, "sc_auth").then(() => sc_auth.access_token);
            });
    },

    doFirstConnectionStuff: (user) => {
        // todo, update after first fetch ...
        // On oauth callback, first time send info, show popup, update history, give money, show completion and open app


        return Promise.resolve()
            .then(() => Features.History.updateUserHistory(user))
            .then(() => Features.Wallet.updateUserWallet({user, addedBalance: Config.appDefaults.welcomeWallet}))
            .then(() => user);
    }
};

module.exports = Users;