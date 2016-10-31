const express = require('express');
const WebServer = require('./modules/webServer');

const App = () => {

    // App definition
    var app = express();
    app.set('port', process.env.PORT || 3000);


    WebServer(app);

    app.listen(app.get('port'), () => {
        console.log("Server started at http://localhost:"+app.get('port'));
    });
};

App();

module.exports = App;
