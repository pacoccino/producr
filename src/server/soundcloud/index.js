const _ = require('lodash');
const request = require('request');

const Config = require('../modules/config');

const Sugar = require('./sugar');
const Resource = require('./resource');
const CacheWrapper = require('../modules/wrappers').Cache;

const SoundCloud = {

    authWithCredentials(username, password) {
        return new Promise((resolve, reject) => {
            var options = {
                url: "https://api.soundcloud.com/oauth2/token",
                method: "POST",
                form: {
                    client_id: Config.services.soundcloud.MAGIC_CLIENT_ID,
                    client_secret: Config.services.soundcloud.MAGIC_CLIENT_SECRET,
                    scope: 'non-expiring',
                    grant_type: 'password',
                    username,
                    password
                }
            };

            request(options, (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    reject({
                        request: options,
                        code: response && response.statusCode,
                        message: response && response.statusMessage,
                        body,
                        error:error
                    });
                } else {
                    const scUser = JSON.parse(body);
                    resolve(scUser);
                }
            });
        });
    },

    isPrivateRequest(requestData) {
        if (requestData.resource === "me") return true;
        if (requestData.resource === "recently-played") return true;

        return (requestData.requestType !== "GET");
    },

    isValidRequest(request) {
        if (SoundCloud.isPrivateRequest(request) && !request.userToken) {
            return false;
        }

        if (request.resource === "users" || request.resource === "me") {
            if (request.resource !== "me" && !request.resourceId) {
                return false;
            }
            if (!request.subResource) {
                return true;
            }
            if (request.subResource === "playlists") {
                return true;
            }
            if (request.subResource === "tracks") {
                return true;
            }
            if (request.subResource === "favorites") {
                return true;
            }
            if (request.subResource === "followings") {
                return true;
            }
        }
        if (request.resource === "playlists") {
            if (request.subResource) {
                return false;
            }
            return true;
        }
        if (request.resource === "tracks") {
            if (request.subResource) {
                return false;
            }
            return true;
        }
        if (request.resource === "recently-played") {
            if (request.subResource === "tracks") {
                return true;
            }
        }
        return false;
    },

    getRequestData(request) {
        var data = null;
        if (!request.requestData) {
            return data;
        }
        if (request.subResource === "playlists") {
            data = {
                playlist: {
                    tracks: request.requestData
                }
            };
        }
        return data;
    },

    buildApiUrl(resourceObject) {

        let url = 'https://';
        url += resourceObject.subApi || 'api';
        url += '.soundcloud.com';

        const addRS = rs => {
            url += !_.isNil(rs) ? '/' + rs : '';
        };

        addRS(resourceObject.resource);
        addRS(resourceObject.resourceId);
        addRS(resourceObject.subResource);
        addRS(resourceObject.subResourceId);

        return url;
    },

    askResource: (resourceObject) => {
        return new Promise((resolve, reject) => {

            /*if (!SoundCloud.isValidRequest(resourceObject)) {
                throw "Not valid request";
            }*/
            var url = SoundCloud.buildApiUrl(resourceObject);

            var params = {};
            params.client_id = Config.services.soundcloud.client_id;
            // params.limit = 10;
            // TODO request options

            var headers = {
                "Content-Type": "application/json"
            };
            if (SoundCloud.isPrivateRequest(resourceObject)) {
                headers.Authorization = "OAuth " + resourceObject.userToken;
            }

            var data = SoundCloud.getRequestData(resourceObject);

            var options = {
                url: url,
                method: resourceObject.requestType,
                qs: params,
                headers: headers
            };

            if (data) {
                options.json = data;
                // or
                // options.data = JSON.stringify(data);
            }

            request(options, function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    var reqError = {
                        request: options,
                        response: response && response.statusCode,
                        message: response && response.statusMessage,
                        body,
                        error
                    };
                    reject(reqError);
                } else {
                    try {
                        body = JSON.parse(body);
                    }
                    catch (e) {
                        console.log('Http response not deserialisable')
                    } finally {
                        resolve(body);
                    }
                }
            });
        });
    },

    cachedResource(resourceObject) {
        return new Promise((resolve, reject) => {
            const resourceUrn = resourceObject.getUrn();

            CacheWrapper.get(resourceUrn)
                .then(cachedResource => {
                    if(cachedResource) {
                        resolve(cachedResource);
                    } else {
                        SoundCloud.askResource(resourceObject)
                            .then((resource) => {
                                CacheWrapper.set(resourceUrn, resource)
                                    .then(resolve, reject);
                            }).catch(reject);

                    }
                })
                .catch(reject);
        });
    }
};

SoundCloud.Sugar = Sugar(SoundCloud);
SoundCloud.Resource = Resource;

module.exports = SoundCloud;
