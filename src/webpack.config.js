const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, '../build');
const APP_DIR = path.resolve(__dirname, 'client');
const ASSETS_DIR = path.resolve(__dirname, 'public');
const ENTRY_FILE = path.resolve(APP_DIR, 'index.js');
const isProduction = process.env.NODE_ENV === 'production';

let plugins = [
    // new webpack.ProvidePlugin({ 'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch' }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
    new HtmlWebpackPlugin({
        template: ASSETS_DIR + '/index.tpl.html',
        inject: 'body',
        filename: 'index.html',
        favicon  : ASSETS_DIR + '/favicon.ico'
    })
];

let modules = {
    loaders : [
        {
            test : /\.jsx?/,
            include : APP_DIR,
            loader : 'babel',
            query: {
                cacheDirectory: true,
                presets: ["react", "es2015", "stage-0"]
            }
        },
        {
            test: /\.json/,
            loader: 'json'
        },
        {
            test: /\.css/,
            loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
        },
        {
            test: /\.(jpg|png)$/,
            loader: 'url?limit=25000'
        }
    ]
};


const webpackConfig = {
    output: {
        path: BUILD_DIR,
        publicPath: '/'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: modules
};

if(isProduction){
    webpackConfig.entry = ENTRY_FILE;
    webpackConfig.output.filename = '[name]-[hash].min.js';

    // TODO remove that ...
    webpackConfig.module.loaders[0].query.presets.push("react-hmre");
    plugins = plugins.concat(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            'output': { 'comments': false },
            'compress': { 'warnings': false, 'screw_ie8': true }
        }),
        new webpack.optimize.DedupePlugin()
    );
} else {
    webpackConfig.devtool = 'eval-source-map';
    webpackConfig.output.filename = '[name].js';

    webpackConfig.module.loaders[0].query.presets.push("react-hmre");
    webpackConfig.entry = [
        'webpack-hot-middleware/client?reload=true',
        ENTRY_FILE
    ];

    plugins = plugins.concat(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    );
}

webpackConfig.plugins = plugins;

module.exports = webpackConfig;