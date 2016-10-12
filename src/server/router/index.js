const PagesRouter = require('./pagesRouter');
const ApiRouter = require('./apiRouter');

const Router = (app) => {

    app.use(PagesRouter());

    app.use('/api', ApiRouter());
};

module.exports = Router;