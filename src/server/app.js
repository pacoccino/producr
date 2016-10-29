const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const cors = require('cors');
const path = require('path');

const Router = require('./router');
const ApiError = require('./modules/apiError');
const Connections = require('./modules/connections');
const Authenticator = require('./modules/authenticator');
const WebServer = require('./modules/webServer');

const Config = require('./modules/config');
const RequestLogger = require('./modules/requestLogger');

const App = () => {

    Connections.initialize().then(() => {
        console.log("Connections initialized");

        // App definition
        var app = express();
        app.set('port', Config.port || 3000);

        // Static file serve
        // if(Config.staticFolder) {
        //     app.use(express.static(Config.staticFolder));
        // }

        app.use(cors({
            origin: true,
            credentials: true
        }));

        // Sessions in redis
        const redisOpt = {
            client: Connections.redis,
            prefix: 'sess::'
        };
        app.use(session({
            store: new RedisStore(redisOpt),
            secret: 'soundcloud cat',
            saveUninitialized: false,
            resave: false,
            cookie: { path: '/', httpOnly: false, secure: false, maxAge: null }
        }));


        // Request parsers
        app.use(require('body-parser').json({ }));
        app.use(require('body-parser').urlencoded({ extended: true }));

        // App middlewares
        app.use(RequestLogger.Middleware());
        app.use(Authenticator.Middleware());
        app.use(Router());

        // app.get('*', function response(req, res) {
        //     res.sendFile(path.join(__dirname, '../../build/index.html'));
        // });

        // Error middleware
        app.use(ApiError.Middleware());

        WebServer(app);

        // Starting server
        app.listen(app.get('port'), () => {
            console.log("Server started at http://localhost:"+app.get('port'));
        });
    })
        .catch(err => {
            console.error("Unable to connect to databases", err);
            process.exit(-1);
        });
};

module.exports = App;
