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
            })
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
            History.updateUserHistory(req.user)
                .then(details => {
                    res.json({
                        success: true,
                        message: 'History updated',
                        details
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
            let hydrate = req.query.hr ? true : false;
            let getFn = null;
            switch(type) {
                case "fromMe":
                    getFn = Transactions.getTransactionsFromUser;
                    break;
                case "toMe":
                    getFn = Transactions.getTransactionsToUser;
                    break;
                default:
                    getFn = Transactions.getUserTransactions;
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
    /*

     Transactions.newTransaction({
     fromUserScId: "10878168",
     toUserScId: "89545741",
     trackId: "242918468",
     amount: 10
     });
     Transactions.newTransaction({
     fromUserScId: "10878168",
     toUserScId: "89545741",
     trackId: "219248965",
     amount: 15
     });
     Transactions.newTransaction({
     fromUserScId: "108647073",
     toUserScId: "10878168",
     trackId: "131977862",
     amount: 20
     });
     Transactions.newTransaction({
     fromUserScId: "108647073",
     toUserScId: "10878168",
     trackId: "77723419",
     amount: 25
     });
     */

    return router;
};

module.exports = ApiRouter;