'use strict';

//Intialize ExpressJS
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

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var http = require('http');
var server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.log('Application node at %s listening on port %d', app.get('domain'), app.get('port'));
});
