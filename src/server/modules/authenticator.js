const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const SoundCloud = require('./../connectors/soundcloud');
const Users = require('./users');

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
                            if (!user.profile) {
                                    user.sc = profile;
                                    user.token = token;
                                }
                            cb(null, user);
                        }
                    );
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

};

module.exports = Authenticator;