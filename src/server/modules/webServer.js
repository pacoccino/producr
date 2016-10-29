const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../../webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';

const staticDirectory = path.join(__dirname, '/../../../build/');

const WebServer = (app) => {

    if (isDeveloping) {
        const compiler = webpack(config);
        const middleware = webpackMiddleware(compiler, {
            publicPath: config.output.publicPath,
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

        app.use(middleware);
        app.use(webpackHotMiddleware(compiler));
        app.get('*', function response(req, res) {
            res.write(middleware.fileSystem.readFileSync(path.join(staticDirectory, "index.html")));
            res.end();
        });
    } else {
        app.use(express.static(staticDirectory));
        app.get('*', function response(req, res) {
            res.sendFile(path.join(staticDirectory, "index.html"));
        });

    }
};

module.exports = WebServer;