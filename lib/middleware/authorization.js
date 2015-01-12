'use strict';

var userResource = require('../user_r');

module.exports = {

  userCanCreateCountry: function(req, res, next) {
    var username = req.user.username;
    userResource.findUserPermission(req.transaction, username, 'country', 'POST', function(err, result) {
      if (err) {
        res.status(500).end();
      } else if (result.rows.length === 0) {
        res.status(403).end();
      } else {
        next();
      }
    });
  }

};