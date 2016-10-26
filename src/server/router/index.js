const express = require('express');

const ApiRouter = require('./apiRouter');

const Router = () => {
    var router = express.Router();

    router.use('/', ApiRouter());

    return router;
};

module.exports = Router;