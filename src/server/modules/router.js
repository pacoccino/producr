const SoundCloud = require('./../connectors/soundcloud');

const Router = (app) => {

    app.get('/',
        function(req, res) {
            res.render('home', { user: req.user });
        });

    app.get('/login',
        function(req, res){
            res.render('login');
        });

    app.get('/logout',
        function(req, res){
            req.logout();
            res.redirect('/');
        });

    app.get('/profile',
        require('connect-ensure-login').ensureLoggedIn('/login'),
        function(req, res){
            res.render('profile', { user: req.user });
        });

    app.get('/history',
        require('connect-ensure-login').ensureLoggedIn('/login'),
        function(req, res, next){
            SoundCloud.Sugar.getHistory(req.user.token)
                .then(history => {
                    res.render('history', { history: history });
                })
                .catch(next);
        });
};

module.exports = Router;