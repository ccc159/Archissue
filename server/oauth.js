'use strict';

// Forge NPM
var forgeSDK = require('forge-apis');

// Forge config information, such as client ID and secret
var config = require('./config');

// Cache of the access tokens
var _cached = [];

module.exports = {
    getTokenPublic: function () {
        return this.OAuthRequest(config.scopePublic, 'public');
    },

    getTokenInternal: function () {
        return this.OAuthRequest(config.scopeInternal, 'internal');
    },

    OAuthRequest: function (scopes, cache) {
        var client_id = config.credentials.client_id;
        var client_secret = config.credentials.client_secret;
        var forgeOAuth = this.OAuthClient(scopes);

        return new Promise(function (resolve, reject) {
            if (_cached[cache] != null && _cached[cache].expires_at > (new Date()).getTime()) {
                resolve(_cached[cache]);
                return;
            }

            var client_id = config.credentials.client_id;
            var client_secret = config.credentials.client_secret;

            //new forgeSDK.AuthClientTwoLegged(client_id, client_secret, scopes);
            forgeOAuth.authenticate()
                .then(function (credentials) {
                    _cached[cache] = credentials;
                    var now = new Date();
                    _cached[cache].expires_at = (now.setSeconds(now.getSeconds() + credentials.expires_in));
                    resolve(_cached[cache]);
                })
                .catch(function (error) {
                    console.log('Error at OAuth Authenticate:');
                    console.log(error);
                    reject(error)
                });
        })
    },

    OAuthClient: function (scopes) {
        var client_id = config.credentials.client_id;
        var client_secret = config.credentials.client_secret;
        if (scopes == undefined) scopes = config.scopeInternal;
        return new forgeSDK.AuthClientTwoLegged(client_id, client_secret, scopes);
    }
}