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

router.route('/cando/:resource/:verb')
  .get(db.transactionMiddleware, function(req, res) {
    // TODO: sanitize resource and verb before passing on to find method...
    userResource.findUserPermission(req.transaction, req.user.username, req.params.resource, req.params.verb, function(err, result) {
      if (err) {
        res.status(500).end();
      } else if (result.rows.length === 0) {
        res.json({canDo: false});
      } else {
        res.json({canDo: true});
      }
    });
  });

router.route('/ismember/:group')
  .get(db.transactionMiddleware, function(req, res) {
    // TODO: sanitize group
    userResource.findUserGroup(req.transaction, req.user.username, req.params.group, function(err, result) {
      if (err) {
        res.status(500).end();
      } else if (result.rows.length === 0) {
        res.json({isMember: false});
      } else {
        res.json({isMember: true});
      }
    });
  });

module.exports = router;