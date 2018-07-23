'use strict';

var app = require('./server/server');

// start server
var server = app.listen(app.get('port'), function () {
  console.log('Starting at ' + (new Date()).toString());
  console.log('Server listening on port ' + server.address().port);
});