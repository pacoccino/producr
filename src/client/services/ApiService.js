const ApiService = {
    apiBaseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
    fetchApi: (endpoint, options) => {
        options = options || {};
        let url  = ApiService.apiBaseUrl;
        if(!endpoint.startsWith('/')) {
            url += "/";
        }
        url += endpoint;

        const apiOpts = {
            credentials: 'include'
        };

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
        return ApiService.fetchApi('history?hr=true')
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
    }
};

module.exports = ApiService;