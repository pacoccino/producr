const express = require('express');

const ApiRouter = require('./apiRouter');

const Router = () => {
    var router = express.Router();

    router.get('/', (req, res) => res.send(null, 200));
    router.use('/api', ApiRouter());

    return router;
};

module.exports = Router;