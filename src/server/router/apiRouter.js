const express = require('express');
const cors = require('cors');
const passport = require('passport');

const SoundCloud = require('../connectors/soundcloud');
const History = require('../modules/history');
const Authenticator = require('../modules/authenticator');

const ApiRouter = () => {
    var router = express.Router();

    router.use(cors({
        origin: true,
        credentials: true
    }));

    router.post('/login',
        Authenticator.apiLogin()
    );
    router.get('/logout',
        Authenticator.apiLogout()
    );

    router.get('/history',
        // Authenticator.apiEnsureLoggedIn(),
        (req, res, next) => {
            req.user = {
                id: 10878168
            };

            History.getUserHistory(req.user, req.query.hr !== undefined)
                .then(history => {
                    res.json( history );
                })
                .catch(next);
        }
    );
    router.get('/update',
        Authenticator.apiEnsureLoggedIn(),
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