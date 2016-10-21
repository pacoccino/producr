const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const Router = require('./router');
const ApiError = require('./modules/apiError');
const Connections = require('./modules/connections');
const Authenticator = require('./modules/authenticator');

const Config = require('./modules/config');
const RequestLogger = require('./modules/requestLogger');

const App = () => {

    Connections.initialize().then(() => {
        console.log("Connections initialized");

        var app = express();
        app.set('port', Config.port || 3000);

        // Request parsers
        app.use(require('body-parser').json({ }));
        app.use(require('body-parser').urlencoded({ extended: true }));

        // App middlewares
        app.use(RequestLogger.Middleware());
        app.use(Authenticator.Middleware());
        app.use(Router());

        // Error middleware
        app.use(ApiError.Middleware());

        // Starting server
        app.listen(app.get('port'), () => {
            console.log("Server started at http://localhost:"+app.get('port'));
        });
    });
};

module.exports = App;
