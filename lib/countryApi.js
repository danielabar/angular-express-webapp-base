'use strict';

var countryDao = require('./countryDao');

var all = function(req, res) {
  countryDao.all(function(err, result) {
    if (err) {
      res.send(500, 'Could not get countries');
    } else {
      res.json(result.rows);
    }
  });
};

var one = function(req, res) {
  var code = req.params.code;
  countryDao.one(code, function(err, result) {
    if (err) {
      res.send(500, 'Could not get country by code: ' + code);
    } else {
      res.json(result.rows);
    }
  });
};

module.exports.all = all;
module.exports.one = one;