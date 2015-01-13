'use strict';

var express = require('express');
var userRoute = require('../user_r');
var router = express.Router();
var db = require('../database');
// var async = require('async');
// var authorization = require('../middleware/authorization');

// Temporarily inject an authenticated user until actual user authentication strategy is implemented
router
  /*jshint unused: false*/
  .use(function(req, res, next) {
    if (!req.user) {
      req.user = {username: 'bsmith'};
    }
    next();
  });

// TODO: Add authorization for GET user
router.route('/')
  .get(db.transactionMiddleware, function(req, res) {
    userRoute.all(req.transaction, function(err, result) {
      if (err) {
        res.status(500).end();
      } else {
        res.status(200).send(result.rows);
      }
    });
  });

module.exports = router;