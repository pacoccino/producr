const _ = require('lodash');

const DBModels = require('../dbModels');

const Wallet = {

    createUserWallet: (user) => {
        return DBModels.Wallets.create()
            .then(wallet => {
                user = user.set('wallet_id', wallet._id);
                // TODO user in req not updated
                DBModels.Users.update(user);

                return wallet;
            });
    },

    getUserWallet: (user) => {

        if(!user.wallet_id) {
            return Wallet.createUserWallet(user);
        } else {
            return DBModels.Wallets.getById(user.wallet_id)
                .then(wallet => {
                    if(wallet) {
                        return wallet;
                    } else {
                        throw new Error("Wallet not found");
                    }
                });
        }
    },

    updateUserWallet: ({ user, balance }) => {

        return Wallet.getUserWallet(user)
            .then(wallet => {
                if(!balance) return wallet;

                wallet = wallet.set('balance', wallet.balance + balance);
                DBModels.Wallets.update(wallet);

                return wallet;
            });
    }
};

module.exports = Wallet;