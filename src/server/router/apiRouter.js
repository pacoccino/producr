const express = require('express');
const cors = require('cors');

const History = require('../modules/history');
const Authenticator = require('../modules/authenticator');

const ApiRouter = () => {
    var router = express.Router();

    router.use(cors({
        origin: true
    }));

    router.post('/login',
        Authenticator.apiLogin(router)
    );
    router.get('/logout',
        Authenticator.apiLogout()
    );

    router.get('/me',
        Authenticator.sendProfile()
    );

    router.get('/history',
        Authenticator.apiEnsureLoggedIn(),
        (req, res, next) => {
            History.getUserHistory({
                user: req.user,
                params: req.query
            }).then(history => {
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
                    res.json({
                        success: true,
                        message: 'History updated'
                    });
                })
                .catch(next);
        }
    );

    return router;
};

module.exports = ApiRouter;