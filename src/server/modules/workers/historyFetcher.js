const DBModels = require('../dbModels');
const Features = require('../features');

const HistoryFetcher = {};

HistoryFetcher.cronDelay = 5 * 60 * 1000; // 5 minutes
// HistoryFetcher.cronDelay = 10 * 1000; // 10 secondes

HistoryFetcher._fetching = false;

const isUserFetchable = (user) => {
    if(!user) return false;
    if(!user.sc_auth) return false;

    return true;
};

HistoryFetcher.fillDatabase = () => {
    for(var i=0; i<10000; i++) {
        DBModels.Large.insert({balance: "jniojoijoijoijoi"});
    }
};

HistoryFetcher.fetch = () => {
    if(HistoryFetcher._fetching) {
        return Promise.reject("History fetch asked but already working");
    }
    HistoryFetcher._fetching = true;
    console.info("History fetch starting");

    const errors = [];
    let updatedUsers = 0;
    let tracksAdded = 0;

    return DBModels.Users.forEachSeries((user, cb) => {
        if(isUserFetchable(user)) {
            Features.History.updateUserHistory(user)
                .then(updateData => {
                    updatedUsers++;
                    tracksAdded += updateData.nbAdded;
                    cb(null);
                })
                .catch(updateError => {
                    errors.push(updateError);
                    cb(null);
                });
        } else {
            cb(null);
        }
    }).then(error => {
        if(error) {
            throw error;
        } else {
            if(errors.length) {
                // TODO rollbar
                console.error('There was some history fetch errors:', errors);
            }
            console.info('History fetch ended, updated '+updatedUsers+' users, '+tracksAdded+' tracks.');
        }
        HistoryFetcher._fetching = false;
    });
};

HistoryFetcher.cron = () => {
    console.info("History cronner enabled");
    function fetch() {
        HistoryFetcher.fetch()
            .catch(err => {
                console.error("History update error", err);
            });
    }
    HistoryFetcher._cronner = setInterval(fetch, HistoryFetcher.cronDelay);
    fetch();
};
HistoryFetcher.stopCron = () => {
    clearInterval(HistoryFetcher._cronner);
    console.info("History cronner disabled");
};

module.exports = HistoryFetcher;