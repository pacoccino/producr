const express = require('express');
const validator = require('validator');

const Authenticator = require('../modules/authenticator');
const History = require('../modules/features/history');
const Transactions = require('../modules/features/transactions');
const Wallet = require('../modules/features/wallet');
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
            History.getUserHistory({
                user: req.user,
                params: req.query
            }).then(history => {
                res.json( history );
            })
                .catch(next);
        }
    );

    // Update user listening history
    router.get('/update',
        Authenticator.apiEnsureLoggedIn(),
        (req, res, next) => {
            History.updateUserHistory(req.user, true)
                .then(() => {
                    res.json({
                        success: true,
                        message: 'History updated'
                    });
                })
                .catch(next);
        }
    );

    // Get user wallet
    router.get('/wallet',
        Authenticator.apiEnsureLoggedIn(),
        (req, res, next) => {
            Wallet.getUserWallet(req.user)
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
            let balance = req.query.balance || req.body.balance;

            if(!validator.isInt(balance)) {
                return next(ApiError.InvalidParams({
                    balance: "integer"
                }));
            }
            balance = validator.toInt(balance);
            Wallet.updateUserWallet({
                user: req.user,
                balance
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
            let getFn = null;
            switch(type) {
                case "fromme":
                    getFn = Transactions.getTransactionsFromUser;
                    break;
                case "tome":
                    getFn = Transactions.getTransactionsToUser;
                    break;
                default:
                    getFn = Transactions.getUserTransactions;
            }

            getFn(req.user)
                .then(transactions => {
                    transactions = transactions.map(transaction => transaction.toJS());
                    res.json(transactions);
                })
                .catch(next);
        }
    );

    return router;
};

module.exports = ApiRouter;