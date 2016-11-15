"use strict";
const cluster = require('cluster');
const uuid = require('node-uuid');
const os = require('os');
const rollbar = require("rollbar");

const Config = require('../../common/config');

class RequestLogger {
    constructor(options) {
        var timestamp = new Date();

        this.logData = {
            _id: uuid.v1(),
            // _id: uuid.v1(),
            date: timestamp.getTime(),
            hostName: os.hostname(),
            duration: timestamp.getTime(),
            description: {},
            error: null
        };
        if(cluster.worker) {
            this.logData.workerId = cluster.worker.id;
        }

        this.logData.steps = [];
    }

    addStep(stepInfo) {
        var step = RequestLogger.getNewStep(stepInfo);
        this.logData.steps.push(step);
    }

    error(error) {
        this.logData.error = error;
    }

    // @private
    _fillWithRequest(req, res) {
        this.logData.req = req;
        this.logData.description = res.statusCode;
        this.logData.path = req.path;
        this.logData.method = req.method;
        this.logData.query = req.query;
        this.logData.ip = req.ip;
        this.logData.environment = Config.environment;

        if(req.user) {
            this.logData.user = {
                _id: req.user._id,
                sc_id: req.user.sc_id,
            };
        }
        if(req.route) {
            this.logData.route = req.baseUrl + req.route.path;
        }
    }

    // @private
    _sendLog(callback) {
        this.logData.duration = Date.now() - this.logData.duration;

        if(this.logData.error) {

            if(Config.rollbarToken) {
                rollbar.handleError(this.logData.error, this.logData.req);
            }

            if(this.logData.error.code === 401) {
                console.error(this.logData.method + ': ' + this.logData.path, "Error",
                    this.logData.error.code
                );
            } else {
                console.error(this.logData.method + ': ' + this.logData.path, "Error",
                    this.logData.error.code,
                    this.logData.error
                );
            }
        } else {
            console.log(this.logData.method + ': ' + this.logData.path, "Success");
        }

        // TODO send log somewhere

        callback && callback();
    }

    static getNewStep(stepInfo) {
        return {
            type: stepInfo.type || "",
            duration: stepInfo.duration || 0,
            success: stepInfo.success ? stepInfo.success : true,
            request: stepInfo.request || null,
            data: stepInfo.data || null,
            requestId: stepInfo.requestId || null
        }
    }
}

RequestLogger.Middleware = () => (req, res, next) => {

    req.logger = new RequestLogger();

    var _send = res.send;

    res.send = function () {
        // Cette variable sert a savoir si on est déjà passé dans le send (cas d'appel à send avec du json)
        if(!res.bypassLog) {
            try {
                res.bypassLog = true;

                res.set("REQUEST-ID", req.logger.logData._id);

                req.logger._fillWithRequest(req, res);
                req.logger._sendLog();
            } catch(e) {
                RequestLogger.SendLogError(e);
            }
        }

        _send.apply(res, arguments);
    };

    next();
};

RequestLogger.SendLogError = (e) => {
    // TODO send somewhere

    if(Config.rollbarToken) {
        rollbar.handleError(e);
    }
    console.error(e);
};

module.exports = RequestLogger;