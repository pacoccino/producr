const express = require('express');

const Router = require('./modules/router');
const Authenticator = require('./modules/authenticator');
const ErrorMiddleware = require('./modules/errorMiddleware');

const Config = require('./config');

const App = () => {

// Create a new Express application.
    var app = express();

// Configure view engine to render EJS templates.
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('port', Config.port || 3000);

    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({ extended: true }));
    app.use(require('express-session')({ secret: 'soundcloud cat', resave: false, saveUninitialized: false }));

    Authenticator(app);
    Router(app);
    
    app.use(ErrorMiddleware);

    app.listen(app.get('port'), () => {
        console.log("Server started at http://localhost:"+app.get('port'));
    });

};

module.exports = App;
