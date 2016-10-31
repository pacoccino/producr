const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';

const WebServer = (app) => {

    if (isDeveloping) {
        const compiler = webpack(webpackConfig);
        const middleware = webpackMiddleware(compiler, {
            publicPath: webpackConfig.output.publicPath,
            contentBase: 'src',
            stats: {
                colors: true,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                modules: false
            }
        });
        const hotMiddleware = webpackHotMiddleware(compiler);

        app.use(middleware);
        app.use(hotMiddleware);

        app.get('*', function response(req, res) {
            res.write(middleware.fileSystem.readFileSync(path.join(webpackConfig.outputFolder, "index.html")));
            res.end();
        });
    } else {
        app.use(express.static(webpackConfig.outputFolder));
        app.get('*', function response(req, res) {
            res.sendFile(path.join(webpackConfig.outputFolder, "index.html"));
        });

    }
};

module.exports = WebServer;