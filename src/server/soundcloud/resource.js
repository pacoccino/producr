const _ = require('lodash');

class SoundCloudResource {
    constructor(user) {
        this.space = 'soundcloud';
        this.resource = null;
        this.resourceId = null;
        this.subResource = null;
        this.subResourceId = null;
        this.userToken = user && user.sc_auth && user.sc_auth.access_token || null;
        this.requestType = "GET";
        this.requestData = null;
        this.requestOptions = null;
    }

    // Privates
    _requestFull() {
        return (this.resource !== null && this.subResource !== null);
    }
    _isResource() {
        return (this.resource !== null && this.subResource === null);
    }
    _isSubResource() {
        return (this.resource !== null && this.subResource !== null);
    }
    _appendResource(resource, id) {

        if(this._requestFull()) {
            throw "Too much resources asked";
        }

        if(this.resource) {
            this.subResource = resource;
        }
        else {
            this.resource = resource;
        }

        if(this._isResource() && !_.isNil(id)) {
            this.resourceId = id;
        }
        if(this._isSubResource() && !_.isNil(id)) {
            this.subResourceId = id;
        }

        return this;
    }

    // Public resources
    users(userId) {
        return this._appendResource("users", userId);
    }
    me() {
        return this._appendResource("me");
    }
    playlists(playlistId) {
        return this._appendResource("playlists", playlistId);
    }
    tracks(trackId) {
        return this._appendResource("tracks", trackId);
    }
    followings(id) {
        return this._appendResource("followings", id);
    }
    favorites(id) {
        return this._appendResource("favorites", id);
    }
    recentlyPlayed() {
        this.subApi = 'api-mobile';
        return this._appendResource("recently-played");
    }

    // Resource method
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

    static fromUrn(urn = "") {
        const parts = urn.split(':');
        if(parts.length !== 3) {
            throw "Invalid URN"
        }

        const ro = new SoundCloudResource();
        ro.space = parts[0];
        ro.resource = parts[1];
        ro.resourceId = parts[2];

        return ro;
    }

    getUrn() {
        return this.space + ':' +
               this.resource + ':' +
               this.resourceId;
    }
}

module.exports = SoundCloudResource;