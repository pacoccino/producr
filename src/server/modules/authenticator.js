const jwt = require('jsonwebtoken');

const SoundCloud = require('../soundcloud');
const Users = require('./users');
const ApiError = require('./apiError');
const Config = require('./config');


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

const SoundCloudStrategy = function (username, password, cb) {

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
};

const Authenticator = {};

Authenticator.Middleware = () => {
    return (req, res, next) => {

        req.isAuthenticated = () => (req.user ? true : false);

        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, Config.jwtSecret, function(err, decoded) {
                if (err) {
                        return res.json(ApiError.JwtError);
                } else {
                    req.user = new Users.Model(decoded);
                    next();
                }
            });
        } else {
            next();
        }
    }
};

Authenticator.apiLogin = () => {
    return (req, res, next) => {

        SoundCloudStrategy(req.body.username, req.body.password, (reqError, user) => {
            if(reqError) {
                // TODO comparer erreur sc et password
                if(reqError.code === 401 && reqError.message === 'Unauthorized') {
                    return next(ApiError.Unavailable)
                }
                if(reqError.code === 401 && reqError.message === 'Unauthorized') {
                    return next(ApiError.BadCredentials)
                }
                return next(reqError);
            }
            var token = jwt.sign(user.toJS(), Config.jwtSecret, {
                expiresIn: 24*60*60 // expires in 24 hours
            });
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
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

Authenticator.sendProfile = () => {
    return (req, res, next) => {
        if(req.isAuthenticated()) {
            res.json(req.user.toClient());
        } else {
            next(ApiError.Unauthorized);
        }
    };
};

module.exports = Authenticator;