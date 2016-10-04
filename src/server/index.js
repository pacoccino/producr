const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const request = require('request');
const passport = require('passport');
const SoundCloudStrategy = require('passport-soundcloud').Strategy;

const config = require('./config');

const app = express();


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret: 'soundcloud cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    req.state = {};
    next();
});

app.use(function (req, res, next) {
    req.state.user = null;
    next();
});

// https://github.com/jaredhanson/passport-soundcloud/blob/master/examples/login/app.js

const Users = new Map();

passport.use(new SoundCloudStrategy({
        clientID: config.SOUNDCLOUD_CLIENT_ID,
        clientSecret: config.SOUNDCLOUD_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/callback?serviceId=soundcloud"
    },
    function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            const user = {
                id: profile.id,
                accessToken,
                refreshToken,
                profile: profile._json,
            };
            Users.set(profile.id, user);

            // To keep the example simple, the user's SoundCloud profile is returned
            // to represent the logged-in user.  In a typical application, you would
            // want to associate the SoundCloud account with a user record in your
            // database, and return that user instead.
            return done(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

app.get('/login',
    passport.authenticate('soundcloud'));

app.get('/auth/callback',
    passport.authenticate('soundcloud', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })
);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.use(function (req, res, next) {
    if (req.user) {

        var options = {
            url: "https://api-mobile.soundcloud.com/recently-played/tracks",
            method: "GET",
            qs: { client_id: config.SOUNDCLOUD_CLIENT_ID },
            headers: {
                Authorization: "OAuth " + req.user.accessToken
            }
        };

        request(options, (error, response, body) => {
            let r = {
                state: "ended",
                user: req.user,
                error,
                response,
                body
            };
            res.json(r);
        });
    } else {
        res.end("Hello !");
    }
});

app.listen(3000, () => {
    console.log("started")
});