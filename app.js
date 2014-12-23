'use strict';

// Intialize ExpressJS
var path = require('path');
var express = require('express');
var compression = require('compression');
var api = require('./lib/api');
var db = require('./lib/database');
var winston = require('winston');

// Express
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
app.use('/api', api);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Logger - TODO: add options for File Transport as per https://github.com/flatiron/winston#working-with-transports
winston.add(winston.transports.File, { filename: process.env.LOG_FILE_NAME });

// Server
var http = require('http');
var server = http.createServer(app);
server.listen(app.get('port'), function() {
  winston.info('Application node at %s listening on port %d', app.get('domain'), app.get('port'));
});

// For supertest API integration testing, consider wrapping this in a if process.env.TEST...
module.exports = app;

var cleanup = function() {
  db.shutdown();
};
process.once('exit', cleanup); //clean exit
process.once('SIGINT', cleanup); //interrupted via ctrl+c

// TODO Investigate the right way to handle uncaught exceptions
// process.once('uncaughtException', cleanup); //uncaught exceptions
app.use(function(err, req, res, next) {
  winston.error(next);
  winston.error(err.stack);
  res.status(500).send('unhandled error');
});
process.on('uncaughtException', function(err) {
  winston.error('Caught exception: ' + err);
  cleanup();
});

// consider wrapping this in if process.env.DEV...
process.once('SIGUSR2', cleanup); //interrupted via ctrl+c when using nodemon BUT not grunt-nodemon???