import ApiService from './ApiService';

const apiUrl = ApiService.apiBaseUrl;

const AuthService = {
    oAuthLogin: () => {
        window.location = apiUrl + '/auth/login';
    },
    oAuthCallback: (code) => {
        return ApiService.fetchApi("/auth/callback?code="+code)
            .then(req => {
                if(req.status === 200) {
                    return;
                } else {
                    throw new Error("oAuth error");
                }
            });
    },
    askLoginPW: (username, password) => {
        return ApiService.fetchApi("/auth/loginpw",
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
            .then(res => {
                if(res.status === 200) {
                    return res.json()
                } else {
                    throw new Error("Login pw error");
                }
            })
            .then(json => {
                ApiService._jwt = json.token;
                localStorage.setItem('jwt', json.token);
                return json.token;
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