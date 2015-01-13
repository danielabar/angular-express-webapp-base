'use strict';

var winston = require('winston');
var logger = winston.loggers.get('resource');

var executeQuery = function(client, statement, params, errMsg, cb) {
  client.query(statement, params, function(err, result) {
    if (err) {
      logger.error(errMsg, {reason: err, stack: err.stack});
      cb(err);
    } else {
      cb(null, result);
    }
  });
};

module.exports = {

  findUserPermission: function(client, username, resource, action, done) {
    var statement = 'SELECT username, group_name, resource, action FROM vw_auth_user_permission WHERE username = $1 AND resource = $2 AND action = $3';
    var params = [username, resource, action];
    var errorMsg = 'An error occurred checking permission for user: ' + username;
    executeQuery(client, statement, params, errorMsg, done);
  },

  findUserGroup: function(client, username, groupName, done) {
    var statement = 'SELECT username, group_name FROM vw_auth_user_group where username = $1 AND group_name = $2';
    var params = [username, groupName];
    var errorMsg = 'An error occurred checking group for user: ' + username;
    executeQuery(client, statement, params, errorMsg, done);
  }

};