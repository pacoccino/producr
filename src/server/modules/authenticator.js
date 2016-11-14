const express = require('express');
const passport = require('passport');
const SoundCloudStrategy = require('passport-soundcloud').Strategy;

const ApiError = require('./apiError');
const Config = require('../../common/config');
const Features = require('./features');

const Authenticator = {};

Authenticator.serializer = (user, cb) => {
    cb(null, user._id);
};

Authenticator.deserializer = (_id, cb) => {
    Features.Users.getById(_id)
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
        const scProfile = profile._json;
        const scAuth = {
            access_token: accessToken,
            refresh_token: refreshToken
        };
        if(refreshToken) {
            scAuth.refresh_token = refreshToken;
            scAuth.type = "expiring";
        } else {
            scAuth.type = "non-expiring";
        }
        Features.Users.getByScId(scProfile.id)
            .then(user => {
                if (user) {
                    Features.Users.updateUserFromAuth(user, scProfile, scAuth)
                        .then(user => {
                            const userInfo = {
                                username: scProfile.username,
                                isNew: false
                            };
                            cb(null, user, userInfo)
                        })
                        .catch(cb);
                } else {
                    Features.Users.newUserFromAuth(scProfile, scAuth)
                        .then(user => {
                            const userInfo = {
                                username: scProfile.username,
                                isNew: true
                            };
                            cb(null, user, userInfo)
                        })
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
        callbackURL: "http://localhost:3000/auth/callback?serviceId=soundcloud",
        // scope: 'non-expiring'
    }, Authenticator.SoundCloudStrategy));

    const authRouter = express.Router();
    authRouter.get('/api/auth/login', passport.authenticate('soundcloud'));
    authRouter.get('/api/auth/callback',
        passport.authenticate('soundcloud'),
        function(req, res) {
            const authInfo = req.authInfo || {};
            res.status(200).json({
                success: true,
                authInfo
            });
        });

    authRouter.get('/api/auth/logout', Authenticator.apiLogout());

    // Force user to re-auth when sc_auth corrupted
    const ensureAuthValid = (req, res, next) => {
        if(req.isAuthenticated() && !req.user.sc_auth) {
            req.logout();
        }
        next();
    };

    return [
        passport.initialize(),
        passport.session(),
        ensureAuthValid,
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