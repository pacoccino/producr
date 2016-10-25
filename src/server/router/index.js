const express = require('express');

const ApiRouter = require('./apiRouter');

const Router = () => {
    var router = express.Router();

    router.use('/api', ApiRouter());

    return router;
};

module.exports = Router;