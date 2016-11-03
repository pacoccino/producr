import ApiService from './ApiService';

const apiUrl = ApiService.apiBaseUrl;

const AuthService = {
    oAuthLogin: () => {
        window.location = apiUrl + '/auth/login';
    },
    oAuthCallback: (code) => {
        return ApiService.fetchApi("/auth/callback?code="+code)
            .then(req => {
                if(req.status !== 200) {
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
                localStorage.setItem(AuthService.JWT_LS_KEY, json.token);
                return json.token;
            });
    },
    logout: () => {
        delete ApiService._jwt;
        localStorage.removeItem(AuthService.JWT_LS_KEY );

        return ApiService.fetchApi('/auth/logout')
            .then(req => req.text());
    }
};

AuthService.JWT_LS_KEY = 'auth_jwt';

const initializeAuth = () => {
    const jwt = localStorage.getItem(AuthService.JWT_LS_KEY );
    if(jwt) {
        ApiService._jwt = jwt;
    }
};

initializeAuth();

export default AuthService;