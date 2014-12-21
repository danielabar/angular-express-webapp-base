'use strict';

// Intialize ExpressJS
var path = require('path');
var express = require('express');
var compression = require('compression');
var app = express();

app.set('domain', process.env.NODE_DOMAIN);
app.set('port', process.env.NODE_PORT);
app.set('app domain', process.env.APP_DOMAIN);
app.set('app port', process.env.APP_PORT);
app.set('views', path.join(__dirname, '/webclient'));
app.set('view engine', 'ejs');
app.enable('trust proxy');
app.use(compression());
app.use(require('body-parser').json());
app.use(require('method-override')());
app.use(express.static('public'));

// Initialize API
var api = require('./lib/api');
var db = require('./lib/database');
app.use('/api', api);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// API
// db.openConnection(function(err, connection) {
//   // Not sure if its right to only have one conn for whole app as per these SO threads
//   //  http://stackoverflow.com/questions/15619456/how-do-i-use-node-postgres-in-a-server
//   //  http://stackoverflow.com/questions/8484404/what-is-the-proper-way-to-use-the-node-js-postgresql-module?lq=1
//   require('./lib/country_r')(app, connection);
// });

// Server
var http = require('http');
var server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.log('Application node at %s listening on port %d', app.get('domain'), app.get('port'));
});

module.exports = app;