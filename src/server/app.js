const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const cors = require('cors');
const path = require('path');

const Router = require('./router');
const ApiError = require('./modules/apiError');
const Connections = require('./modules/connections');
const Authenticator = require('./modules/authenticator');
const JWTAuthenticator = require('./modules/JWTAuth');
const WebServer = require('./modules/webServer');

const HistoryFetcher = require('./modules/workers/historyFetcher');
const Features = require('./modules/features');

const Config = require('./modules/config');
const RequestLogger = require('./modules/requestLogger');

const App = () => {

    Connections.initialize()
        .catch(err => {
            console.error("Unable to connect to databases", err);
            process.exit(-1);
        })
        .then(() => {
            console.log("Connections initialized");

            // App definition
            var app = express();
            app.set('port', Config.port || 3000);

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
            app.use(JWTAuthenticator.Middleware());
            app.use(Router());

            // Error middleware
            app.use(ApiError.Middleware());

            WebServer(app);
            Features.init();
            HistoryFetcher.cron();

            // Starting server
            app.listen(app.get('port'), () => {
                console.log("Server started at http://localhost:"+app.get('port'));
            });
        })
        .catch(err => {
            console.error("Error while bootstrapping server", err);
            process.exit(-1);
        });
};

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err)
});

module.exports = App;
