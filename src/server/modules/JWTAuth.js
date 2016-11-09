const jwt = require('jsonwebtoken');
const express = require('express');

const SoundCloud = require('../soundcloud');
const ApiError = require('./apiError');
const Config = require('./config');
const Features = require('./features');

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
            return Features.Users.getByScId(scProfile.id)
        })
        .then(user => {
            if(user) {
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
                Features.Users.getById(decoded.userId)
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

    SoundCloudLogin(username, password, (reqError, user, authInfo) => {
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
        res.status(200).json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            authInfo
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