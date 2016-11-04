const _ = require('lodash');

const DBModels = require('../dbModels');

const Wallet = {

    createUserWallet: (user) => {
        return DBModels.Wallets.insert()
            .then(wallet => {
                user = user.set('wallet_id', wallet._id);
                // TODO user in req not updated
                return DBModels.Users.updateField(user, "wallet_id")
                    .then(updatedUser => wallet);
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

    updateUserWallet: ({ user, addedBalance }) => {

        // TODO check if user doesnt exists
        return Wallet.getUserWallet(user)
            .then(wallet => {
                if(!wallet) {
                    throw new Error("Wallet not found");
                }
                if(!addedBalance) return wallet;

                const incData = {
                    balance: addedBalance
                };

                return DBModels.Wallets.incField(wallet, incData);
            });
    }
};

module.exports = Wallet;