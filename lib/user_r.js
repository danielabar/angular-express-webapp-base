'use strict';

var winston = require('winston');
var logger = winston.loggers.get('resource');

module.exports = {

  findUserPermission: function(client, username, resource, action, done) {
    var statement = 'SELECT username, group_name, resource, action FROM vw_auth_user_permission WHERE username = $1 AND resource = $2 AND action = $3';
    var params = [username, resource, action];
    client.query(statement, params, function(err, result) {
      if (err) {
        logger.error('An error occurred checking permission for user: ' + username + '.', {reason: err, stack: err.stack});
        done(err);
      } else {
        done(null, result);
      }
    });
  }

};