const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const SoundCloud = require('../connectors/soundcloud');
const History = require('../modules/history');

const ApiRouter = () => {
    var router = express.Router();

    router.get('/history', ensureLoggedIn(),
        (req, res, next) => {
            History.getUserHistory(req.user, req.query.hr !== undefined)
                .then(history => {
                    res.json( history );
                })
                .catch(next);
        }
    );
    router.get('/update', ensureLoggedIn(),
        (req, res, next) => {
            History.updateUserHistory(req.user)
                .then(history => {
                    res.redirect( '/api/history' );
                })
                .catch(next);
        }
    );

    return router;
};

module.exports = ApiRouter;