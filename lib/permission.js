'use strict';

var express = require('express');
var userResource = require('./user_r');
var router = express.Router();
var db = require('./database');

// Temporarily inject an authenticated user until actual user authentication strategy is implemented
router
  /*jshint unused: false*/
  .use(function(req, res, next) {
    if (!req.user) {
      req.user = {username: 'bsmith'};
    }
    next();
  });

router.route('/canCreateCountry')
  .get(db.transactionMiddleware, function(req, res) {
    userResource.findUserPermission(req.transaction, req.user.username, 'country', 'POST', function(err, result) {
      if (err) {
        res.status(500).end();
      } else if (result.rows.length === 0) {
        res.json({canDo: false});
      } else {
        res.json({canDo: true});
      }
    });
  });

module.exports = router;