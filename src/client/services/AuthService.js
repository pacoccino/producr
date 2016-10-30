import ApiService from './ApiService';

const apiUrl = ApiService.apiBaseUrl;

const AuthService = {
    oAuthLogin: () => {
        window.location = apiUrl + '/auth/login';
    },
    askLoginPW: (username, password) => {
        return ApiService.fetchApi("/auth/login",
            {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(req => {
                if(req.status === 200) {
                    return req.json()
                } else {
                    return null;
                }
            })
            .then(json => {
                ApiService._jwt = json.token;
                localStorage.setItem('jwt', json.token);
                // TODO put jwt in fetch headers
            });
    },
    logout: () => {
        delete ApiService._jwt;
        localStorage.removeItem('jwt');

        return ApiService.fetchApi('/auth/logout')
            .then(req => req.text());
    }
};

AuthService.JWT_LS_KEY = 'auth_jwt';

export default AuthService;