import ApiService from './ApiService';

const apiUrl = ApiService.ApiURL;

const AuthService = {
    askLogin: (username, password) => {
        return fetch(apiUrl + "/login",
            {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                mode: 'cors'
            })
            .then(req => {
                if(req.status === 200) {
                    return req.json()
                } else {
                    return null;
                }
            });
    },
    logout: () => {
        return fetch(apiUrl + '/logout',
            {
                mode: 'cors'
            })
            .then(req => req.text());
    }
};

AuthService.JWT_LS_KEY = 'auth_jwt';

module.exports = AuthService;