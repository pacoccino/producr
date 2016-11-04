const DBModels = require('../dbModels');

const Users = {

    getById: (_id) => {
        return DBModels.Users.getById(_id);
    },
    getByScId: (sc_id) => {
        return DBModels.Users.getById(sc_id, "sc_id");
    },

    newUserFromAuth: (profile, auth) => {
        const uts = {
            sc_id: profile.id,
            sc_profile: profile,
            sc_auth: auth,
        };
        return DBModels.Users.insert(uts);
    },

    updateUserFromAuth: (user, profile, auth) => {
        user = user.set('sc_profile', profile);
        user = user.set('sc_auth', auth);

        // TODO update multipleFields
        return DBModels.Users.update(user);
    },
};

module.exports = Users;