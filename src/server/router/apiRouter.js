const express = require('express');
const validator = require('validator');

const Authenticator = require('../modules/authenticator');
const Features = require('../modules/features');
const ApiError = require('../modules/apiError');

const ApiRouter = () => {
    var router = express.Router();

    router.get('/', (req, res) => res.status(200).send(null));

    // Get user profile
    router.get('/me',
        Authenticator.apiEnsureLoggedIn(),
        (req, res) => {
            res.json(req.user.toClient());
        }
    );

    // Get user listening history
    router.get('/history',
        Authenticator.apiEnsureLoggedIn(),
        (req, res, next) => {
            Features.History.getUserHistory(req.user, req.query)
                .then(userHistory => {
                    userHistory.history = userHistory.history.map(obj => obj.toJS());
                    res.json( userHistory );
                })
                .catch(next);
        }
    );

    // Update user listening history
    router.get('/update',
        Authenticator.apiEnsureLoggedIn(),
        (req, res, next) => {
            // TODO catch when fetching
            Features.History.updateUserHistory(req.user)
                .then(details => {
                    res.json({
                        success: true,
                        message: 'History updated',
                        details
                    });
                })
                .catch(error => {
                    if(error.isFetching) {
                        next(ApiError.Custom("User history already fetching"));
                    } else {
                        next(error);
                    }
                });
        }
    );

    // Get user wallet
    router.get('/wallet',
        Authenticator.apiEnsureLoggedIn(),
        (req, res, next) => {
            Features.Wallet.getUserWallet(req.user)
                .then(wallet => {
                    res.json(wallet.toJS());
                })
                .catch(next);
        }
    );
    // Adds some balance to user wallet
    router.put('/wallet',
        Authenticator.apiEnsureLoggedIn(),
        (req, res, next) => {
            let addedBalance = req.query.balance || req.body.balance;

            if(!validator.isInt(addedBalance)) {
                return next(ApiError.InvalidParams({
                    balance: "integer"
                }));
            }
            addedBalance = validator.toInt(addedBalance);
            Features.Wallet.updateUserWallet({
                user: req.user,
                addedBalance
            })
                .then(wallet => {
                    res.json(wallet.toJS());
                })
                .catch(next);
        }
    );

    // Get user wallet
    router.get('/transactions',
        Authenticator.apiEnsureLoggedIn(),
        (req, res, next) => {
            let type = req.query.type;
            let hydrate = req.query.hr ? true : false;
            let getFn = null;
            switch(type) {
                case "fromMe":
                    getFn = Features.Transactions.getTransactionsFromUser;
                    break;
                case "toMe":
                    getFn = Features.Transactions.getTransactionsToUser;
                    break;
                default:
                    getFn = Features.Transactions.getUserTransactions;
            }

            getFn(req.user)
                .then(transactions => {
                    return transactions.map(transaction => transaction.toJS());
                })
                .then(transactions => {
                    res.json(transactions);
                })
                .catch(next);
        }
    );

    return router;
};

module.exports = ApiRouter;