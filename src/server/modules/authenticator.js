const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const SoundCloud = require('../soundcloud');
const Users = require('./users');
const ApiError = require('./apiError');


const updateUser = (user, profile, auth) => {
    user = user.set('sc_profile', profile);
    user = user.set('sc_auth', auth);

    return Users.update(user);
};

const createUser = (profile, auth) => {
    const uts = {
        sc_id: profile.id,
        sc_profile: profile,
        sc_auth: auth,
    };
    return Users.create(uts);
};

const Authenticator = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new Strategy(
        function (username, password, cb) {

            let scAuth = null;
            let scProfile = null;
            SoundCloud.authWithCredentials(username, password)
                .then(auth => {
                    scAuth = auth;
                    return SoundCloud.Sugar.getProfile(scAuth.access_token)
                })
                .then(profile => {
                    scProfile = profile;
                    return Users.getById(profile.id);
                })
                .then(user => {
                    if(user) {
                        updateUser(user, scProfile, scAuth)
                            .then(user => cb(null, user))
                            .catch(cb);
                    } else {
                        createUser(scProfile, scAuth)
                            .then(user => cb(null, user))
                            .catch(cb);
                    }
                })
                .catch(cb);
        }));


    passport.serializeUser(function (user, cb) {
        cb(null, user._id);
    });

    passport.deserializeUser(function (_id, cb) {
        Users.getById(_id)
            .then(user => cb(null, user))
            .catch(cb);
    });
};

Authenticator.apiLogin = () => {
    return (req, res, next) => {
        passport.authenticate('local')(req, res, (e) => {
            if(e) {
                return next(e);
            }
            if(req.isAuthenticated()) {
                res.status(200);
                res.json(req.user);
            } else {
                res.status(401);
                res.send("Bad credentials");
            }
        });
    };
};

Authenticator.apiLogout = () => {
    return (req, res) => {
        if(req.isAuthenticated && req.isAuthenticated()) {
            req.logout();
        }
        res.status(200);
        res.send('ok');
    };
};

Authenticator.apiEnsureLoggedIn = () => {
    return (req, res, next) => {

        if (!req.isAuthenticated || !req.isAuthenticated()) {
            return next(ApiError.Unauthorized);
        }
        next();
    };
};

module.exports = Authenticator;