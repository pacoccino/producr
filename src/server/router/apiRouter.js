const express = require('express');
const cors = require('cors');

const History = require('../modules/history');
const Authenticator = require('../modules/authenticator');
const DBModels = require('../modules/dbModels');

const ApiRouter = () => {
    var router = express.Router();

    router.get('/', (req, res) => res.status(200).send(null));

    router.use(cors({
        origin: true
    }));

    router.post('/login',
        Authenticator.apiLogin()
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

    router.get('/wallet',
        Authenticator.apiEnsureLoggedIn(),
        (req, res, next) => {
            DBModels.Wallets.getById(req.user.wallet_id)
                .then(wallet => {
                    if(wallet) {
                        res.json(wallet.toJS());
                    } else {
                        DBModels.Wallets.create()
                            .then(wallet => {
                                req.user = req.user.set('wallet_id', wallet._id);
                                DBModels.Users.update(req.user)
                                    .then(() => {
                                        res.json(wallet.toJS());
                                    });
                            });
                    }
                })
                .catch(next);
        }
    );

    return router;
};

module.exports = ApiRouter;