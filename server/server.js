'use strict';

var express = require('express');
var cors = require('cors');
var app = express();

// prepare server routing
app.use(cors())
app.use('/', express.static(__dirname + '/../www')); // redirect static calls
app.set('port', process.env.PORT); // main port

// cookie-based session
var cookieSession = require('cookie-session')
app.use(cookieSession({
    name: 'forgesession',
    keys: ['forgesecurekey'],
    secure: (process.env.NODE_ENV == 'production'),
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days, same as refresh token
}))

// prepare our API endpoint routing
loadRoute('./oauthtoken');
// viewmodels sample
loadRoute('./oss');
loadRoute('./modelderivative');
// view hub models sample
loadRoute('./datamanagement');
loadRoute('./user');

function loadRoute(path) {
    try {
        require.resolve(path);
        var m = require(path);
        app.use('/', m);
    } catch (e) { }
}

module.exports = app;