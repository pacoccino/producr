const jwt = require('jsonwebtoken');
const express = require('express');

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
    return DBModels.Users.insert(uts);
};

const updateUser = (user, profile, auth) => {
    user = user.set('sc_profile', profile);
    user = user.set('sc_auth', auth);

    return DBModels.Users.update(user);
};

const SoundCloudLogin = function (username, password, cb) {

    let scAuth = null;
    let scProfile = null;
    SoundCloud.authWithCredentials(username, password)
        .then(auth => {
            scAuth = auth;
            return SoundCloud.Sugar.getProfile(scAuth.access_token)
        })
        .then(profile => {
            scProfile = profile;
            return DBModels.Users.getById(profile.id, "sc_id");
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
};

const jwtMiddleware = (req, res, next) => {
    // If user already authenticated w/ passport cookies
    if(req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    req.isAuthenticated = () => (req.user ? true : false);

    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, Config.jwt.secret, function(err, decoded) {
            if (err) {
                if(err.name === "TokenExpiredError") {
                    return next(ApiError.TokenExpired());
                }
                if(err.name === "JsonWebTokenError") {
                    return next(ApiError.InvalidToken(err));
                }
                return next(err);
            } else {
                DBModels.Users.getById(decoded.userId)
                    .then(user => {
                        if(user) {
                            req.user = user;
                            return next();
                        } else {
                            throw ApiError.InvalidToken();
                        }
                    })
                    .catch(err => {
                        return next(err);
                    });
            }
        });
    } else {
        return next();
    }
};

const pwAuthMiddleware = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    SoundCloudLogin(username, password, (reqError, user) => {
        if(reqError) {
            if(reqError.code === 401 && reqError.body && reqError.body.error === 'invalid_grant') {
                return next(ApiError.BadCredentials())
            }
            if(reqError.code === 401 && reqError.message === 'Unauthorized') {
                return next(ApiError.Unavailable(reqError))
            }
            return next(reqError);
        }
        const jwtToStore = {
            userId: user._id.toString()
        };

        const token = jwt.sign(jwtToStore, Config.jwt.secret, {
            expiresIn: Config.jwt.expiration // expires in 10 days
        });
        res.status(201).json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
    });
};

const Authenticator = {};

Authenticator.Middleware = () => {

    const authRouter = express.Router();
    authRouter.post('/api/auth/loginpw', pwAuthMiddleware);

    return [
        jwtMiddleware,
        authRouter
    ];
};

module.exports = Authenticator;