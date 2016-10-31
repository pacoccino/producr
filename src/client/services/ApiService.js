const ApiService = {
    apiBaseUrl: '/api',
    // apiBaseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : '/api',
    fetchApi: (endpoint, options) => {
        options = options || {};
        let url  = ApiService.apiBaseUrl;
        if(!endpoint.startsWith('/')) {
            url += "/";
        }
        url += endpoint;

        const apiOpts = {};

        if(ApiService._jwt) {
            apiOpts.headers = {
                "x-access-token": ApiService._jwt
            };
        } else {
            apiOpts.credentials = "include";
        }

        const reqOpts = Object.assign({}, apiOpts, options);

        return fetch(url, reqOpts);
    },

    getMe: () => {
        return ApiService.fetchApi('me')
            .then(req => {
                if(req.status === 200) {
                    return req.json();
                } else {
                    throw new Error("getMeError");
                }
            });
    },

    getHistory: () => {
        return ApiService.fetchApi('history')
            .then(req => req.json());
    },
    updateHistory: () => {
        return ApiService.fetchApi('update')
            .then(req => req.json())
            .then(result => {
                if(result.success) {
                    return true;
                } else {
                    throw new Error(result.message);
                }
            });
    },

    getWallet: () => {
        return ApiService.fetchApi('wallet')
            .then(req => req.json());
    },
    updateWallet: () => {
        return ApiService.fetchApi('wallet?balance=10', {method: 'PUT'})
            .then(req => req.json());
    },

    getTransactions: (type) => {
        let url = 'transactions';
        if(type === "fromme") {
            url += "?type=fromMe";
        } else if(type === "tome") {
            url += "?type=toMe";
        }
        return ApiService.fetchApi(url)
            .then(req => req.json());
    },
};

function initializeApi() {
    const jwt = localStorage.getItem('jwt');
    if(jwt) {
        ApiService._jwt = jwt;
    }
}

initializeApi();

export default ApiService;