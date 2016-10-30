const express = require('express');
const passport = require('passport');
const SoundCloudStrategy = require('passport-soundcloud').Strategy;

const SoundCloud = require('../soundcloud');
const DBModels = require('./dbModels');
const ApiError = require('./apiError');
const Config = require('./config');

const createUser = (profile, auth) => {
    const uts = {
        sc_id: profile.id,
        sc_profile: profile,
        sc_auth: auth,
    };
    return DBModels.Users.create(uts);
};

const updateUser = (user, profile, auth) => {
    user = user.set('sc_profile', profile);
    user = user.set('sc_auth', auth);

    return DBModels.Users.update(user);
};

const Authenticator = {};

Authenticator.serializer = (user, cb) => {
    cb(null, user._id);
};

Authenticator.deserializer = (_id, cb) => {
    DBModels.Users.getById(_id)
        .then(user => {
            if(user) {
                cb(null, user);
            } else {
                cb(null, false);
            }
        })
        .catch(cb);
};

Authenticator.SoundCloudStrategy = (accessToken, refreshToken, profile, cb) => {

    process.nextTick(function () {
        let scProfile = profile._json;
        let scAuth = {
            access_token: accessToken,
            refresh_token: refreshToken
        };
        DBModels.Users.getById(scProfile.id, "sc_id")
            .then(user => {
                if (user) {
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
    });
};

Authenticator.Middleware = () => {
    passport.serializeUser(Authenticator.serializer);
    passport.deserializeUser(Authenticator.deserializer);

    passport.use(new SoundCloudStrategy({
        clientID: Config.services.soundcloud.client_id,
        clientSecret: Config.services.soundcloud.client_secret,
        callbackURL: "http://localhost:3000/auth/callback?serviceId=soundcloud"
    }, Authenticator.SoundCloudStrategy));

    const authRouter = express.Router();
    authRouter.get('/api/auth/login', passport.authenticate('soundcloud'));
    authRouter.get('/auth/callback',
        passport.authenticate('soundcloud'),
        function(req, res) {
            res.redirect('/');
        });

    authRouter.get('/api/auth/logout', Authenticator.apiLogout());

    return [
        passport.initialize(),
        passport.session(),
        authRouter
    ];
};

Authenticator.apiLogout = () => {
    return (req, res) => {
        if(req.isAuthenticated && req.isAuthenticated()) {
            req.logout();
        }
        res.status(200).send(null);
    };
};

Authenticator.apiEnsureLoggedIn = () => {
    return (req, res, next) => {

        if (!req.isAuthenticated || !req.isAuthenticated()) {
            return next(ApiError.Unauthorized());
        }
        next();
    };
};

module.exports = Authenticator;