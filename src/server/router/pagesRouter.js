const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const SoundCloud = require('../connectors/soundcloud');
const History = require('../modules/history');

const ApiRouter = () => {
    var router = express.Router();

    router.get('/',
        function(req, res) {
            res.render('home', { user: req.user });
        });

    router.get('/login',
        function(req, res){
            res.render('login');
        });

    router.get('/profile', ensureLoggedIn('/login'),
        function(req, res){
            res.render('profile', { user: req.user });
        });

    router.get('/history', ensureLoggedIn('/login'),
        function(req, res, next){
            SoundCloud.Sugar.getHistory(req.user.token)
                .then(history => {
                    res.render('history', { history: history });
                })
                .catch(next);
        });
    return router;
};

module.exports = ApiRouter;