const apiUrl = location.origin + '/api';

const ApiService = {
    getMe: (jwt) => {
        return fetch(apiUrl + '/me',
            {
                headers: {
                    'x-access-token': jwt
                }
            })
            .then(req => {
                if(req.status === 200) {
                    return req.json();
                } else {
                    throw new Error("getMeError");
                }
            });
    },
    getHistory: (jwt) => {
        return fetch(apiUrl + '/history?hr=true',
            {
                headers: {
                    'x-access-token': jwt
                }
            })
            .then(req => req.json());
    },
    updateHistory: (jwt) => {
        return fetch(apiUrl + '/update',
            {
                headers: {
                    'x-access-token': jwt
                }
            })
            .then(req => req.json())
            .then(result => {
                if(result.success) {
                    return true;
                } else {
                    throw new Error(result.message);
                }
            });
    }
};

ApiService.ApiURL = apiUrl;

module.exports = ApiService;