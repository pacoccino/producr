const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const SoundCloud = require('../soundcloud');
const Users = require('./users');
const ApiError = require('./apiError');


const createUser = (profile, auth) => {
    const uts = {
        sc_id: profile.id,
        sc_profile: profile,
        sc_auth: auth,
    };
    return Users.create(uts);
};

const updateUser = (user, profile, auth) => {
    user = user.set('sc_profile', profile);
    user = user.set('sc_auth', auth);

    return Users.update(user);
};

const Authenticator = {};

Authenticator.applyMiddleware = (app) => {
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
        passport.authenticate('local')(req, res, (reqError) => {
            if(reqError) {
                // TODO comparer erreur sc et password
                if(reqError.code === 401 && reqError.message === 'Unauthorized') {
                    return next(ApiError.Unavailable)
                }
                if(reqError.code === 401 && reqError.message === 'Unauthorized') {
                    return next(ApiError.BadCredentials)
                }
                return next(ApiError.Unknown);
            }
            Authenticator.sendProfile()(req, res);
        });
    };
};

Authenticator.sendProfile = () => {
    return (req, res) => {
        if(req.isAuthenticated()) {
            res.status(200);
            res.json(req.user.toClient());
        } else {
            next(ApiError.Unauthorized);
        }
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