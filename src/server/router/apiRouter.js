const express = require('express');
const cors = require('cors');
const passport = require('passport');

const SoundCloud = require('../soundcloud');
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

    router.get('/me',
        (req, res, next) => {
            if(req.isAuthenticated && req.isAuthenticated()) {
                res.json(req.user.sc);
            } else {
                res.status(401);
                res.send("Unauthenticated");
            }

        }
    );

    router.get('/history',
        Authenticator.apiEnsureLoggedIn(),
        (req, res, next) => {
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
                .then(() => {
                    res.status(200);
                    res.send('ok');
                })
                .catch(next);
        }
    );

    return router;
};

module.exports = ApiRouter;