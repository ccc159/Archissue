'use strict';

// web framework
var express = require('express');
var router = express.Router();

// Forge NPM
var forgeSDK = require('forge-apis');

// actually perform the token operation
var oauth = require('./oauth');

// Endpoint to return a 2-legged access token
router.get('/api/forge/oauth/token', function (req, res) {
    oauth.getTokenPublic().then(function (credentials) {
        res.json({ access_token: credentials.access_token, expires_in: credentials.expires_in });
    }).catch(function (error) {
        console.log('Error at OAuth Token:');
        console.log(error);
        res.status(500).json(error);
    });
});

module.exports = router;