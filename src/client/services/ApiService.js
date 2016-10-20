const apiUrl = 'http://localhost:3001';

const ApiService = {
    getMe: (jwt) => {
        return fetch(`http://localhost:3001/api/me`,
            {
                method: "GET",
                mode: 'cors',
                headers: {
                    'x-access-token': jwt
                }
            })
            .then(req => {
                if(req.status === 200) {
                    return req.json()
                } else {
                    return null;
                }
            });
    },
    getHistory: (jwt) => {
        return fetch(apiUrl + '/api/history?hr=true',
            {
                mode: 'cors',
                headers: {
                    'x-access-token': jwt
                }
            })
            .then(req => req.json());
    },
    updateHistory: (jwt) => {
        return fetch(apiUrl + '/api/history?hr=true',
            {
                mode: 'no-cors',
                headers: {
                    'x-access-token': jwt
                }
            })
            .then(req => req.json());
    }
};

ApiService.ApiURL = apiUrl;

module.exports = ApiService;