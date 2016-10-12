const _ = require('lodash');
const request = require('request');

const Config = require('../config');

const Sugar = require('./soundcloudSugar');

const SoundCloud = {

    authWithCredentials(username, password) {
        return new Promise((resolve, reject) => {
            var options = {
                url: "https://api.soundcloud.com/oauth2/token",
                method: "POST",
                form: {
                    client_id: Config.MAGIC_CLIENT_ID,
                    client_secret: Config.MAGIC_CLIENT_SECRET,
                    scope: 'non-expiring',
                    grant_type: 'password',
                    username,
                    password
                }
            };

            request(options, (error, response, body) => {
                if (error || response.statusCode !== 200) {

                    var reqError = {
                        request: options,
                        code: response.statusCode,
                        message: response.statusMessage,
                        body
                    };
                    reject(reqError);
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

    askResource: (resourceObject)=> {
        return new Promise((resolve, reject) => {

            /*if (!SoundCloud.isValidRequest(resourceObject)) {
                throw "Not valid request";
            }*/
            var url = SoundCloud.buildApiUrl(resourceObject);

            var params = {};
            params.client_id = Config.SOUNDCLOUD_CLIENT_ID;
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
                        code: response.statusCode,
                        message: response.statusMessage,
                        body
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
    }
};

SoundCloud.Sugar = Sugar(SoundCloud);

module.exports = SoundCloud;
