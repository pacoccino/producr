const ApiRouter = require('./apiRouter');

const Router = {
    applyMiddleware: (app) => {
        app.get('/', (req, res) => res.send(null, 200));
        app.use('/api', ApiRouter());
    }
};

module.exports = Router;