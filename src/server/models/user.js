class User {
    constructor(userId) {
        this.id = userId;
        this.token = null;
        this.sc = null;
    }

    toJSON() {
        return {
            id: this.id,
            token: this.token,
            sc: this.sc
        }
    }
}

module.exports = User;