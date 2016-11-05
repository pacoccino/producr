const DBModels = require('../dbModels');

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
        return DBModels.Users.insert(uts);
    },

    updateUserFromAuth: (user, sc_profile, sc_auth) => {
        user = user.set('sc_profile', sc_profile);
        user = user.set('sc_auth', sc_auth);

        const fields = {
            sc_profile,
            sc_auth
        };

        return DBModels.Users.updateFields(user, fields);
    },
};

module.exports = Users;