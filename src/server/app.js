const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const Router = require('./router');
const ApiError = require('./modules/apiError');
const Connections = require('./modules/connections');
const Authenticator = require('./modules/authenticator');

const Config = require('./modules/config');

const App = () => {

    Connections.initialize().then(() => {
        console.log("Connections initialized");


        var app = express();

        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');
        app.set('port', Config.port || 3000);

        app.use(require('cookie-parser')());
        app.use(require('body-parser').json({ }));
        app.use(require('body-parser').urlencoded({ extended: true }));

        const redisOpt = {
            client: Connections.redis,
            prefix: 'sess'
        };
        app.use(session({
            store: new RedisStore(redisOpt),
            secret: 'soundcloud cat',
            resave: false,
            saveUninitialized: false
        }));

        app.use((req, res, next) => {
            console.log(req.method + ': ' + req.path);
            next();
        });

        Authenticator(app);
        Router(app);

        app.use(ApiError.Middleware);

        app.listen(app.get('port'), () => {
            console.log("Server started at http://localhost:"+app.get('port'));
        });
    });
};

module.exports = App;
