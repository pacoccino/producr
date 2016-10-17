const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const SoundCloud = require('../soundcloud');
const Users = require('./users');
const ApiError = require('./apiError');

const Authenticator = (app) => {

    passport.use(new Strategy(
        function (username, password, cb) {

            let token = null;
            SoundCloud.authWithCredentials(username, password)
                .then(auth => {
                    token = auth.access_token;
                    return SoundCloud.Sugar.getProfile(token)
                })
                .then(profile => {
                    Users.findOrCreate(profile.id)
                        .then(user => {
                            if (!user.sc) {
                                    user.sc = profile;
                                    user.token = token;
                                }
                            Users.updateUser(user.id, user);
                            cb(null, user);
                        })
                        .catch(cb);
                }).catch(cb);
        }));


    passport.serializeUser(function (user, cb) {
        cb(null, user.id);
    });

    passport.deserializeUser(function (id, cb) {
        Users.getById(id).then(user => {
            cb(null, user);
        }).catch(cb);
    });


    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login',
        passport.authenticate('local', {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/history');
        }
    );

    app.get('/logout',
        function(req, res){
            if(req.user) {
                Users.delete(req.user.id).then(() => {
                    req.logout();
                    res.redirect('/');
                });
            } else {
                req.logout();
                res.redirect('/');
            }
        });
};

Authenticator.apiLogin = () => {
    return (req, res, next) => {
        passport.authenticate('local')(req, res, () => {
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