const _ = require('lodash');

class ResourceObject {
    constructor(userToken) {
        this.resource = null;
        this.resourceId = null;
        this.subResource = null;
        this.subResourceId = null;
        this.userToken = userToken || null;
        this.requestType = "GET";
        this.requestData = null;
        this.requestOptions = null;
    }

    requestFull() {
        return (this.resource !== null && this.subResource !== null);
    }

    isResource() {
        return (this.resource !== null && this.subResource === null);
    }
    isSubResource() {
        return (this.resource !== null && this.subResource !== null);
    }

    appendResource(resource, id) {

        if(this.requestFull()) {
            throw "Too much resources asked";
        }

        if(this.resource) {
            this.subResource = resource;
        }
        else {
            this.resource = resource;
        }

        if(this.isResource() && !_.isNil(id)) {
            this.resourceId = id;
        }
        if(this.isSubResource() && !_.isNil(id)) {
            this.subResourceId = id;
        }

        return this;
    }

    users(userId) {
        return this.appendResource("users", userId);
    }
    me() {
        return this.appendResource("me");
    }
    playlists(playlistId) {
        return this.appendResource("playlists", playlistId);
    }
    tracks(trackId) {
        return this.appendResource("tracks", trackId);
    }
    followings(id) {
        return this.appendResource("followings", id);
    }
    favorites(id) {
        return this.appendResource("favorites", id);
    }
    recentlyPlayed() {
        this.subApi = 'api-mobile';
        return this.appendResource("recently-played");
    }

    get(options) {
        this.requestType = "GET";
        this.requestOptions = options;
    }
    post(data) {
        this.requestType = "POST";
        this.requestData = data;
    }
    put(data) {
        this.requestType = "PUT";
        this.requestData = data;
    }

    fromUrn(urn = "") {
        const parts = urn.split(':');
        if(parts.length !== 3) {
            throw "Invalid URN"
        }
        this.resource = parts[1];
        this.resourceId = parts[2];
    }
}

module.exports = ResourceObject;