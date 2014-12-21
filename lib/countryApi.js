'use strict';

var countryDao = require('./countryDao');

// TODO Log the error (decide on a logging lib)

var all = function(req, res) {
  countryDao.all(function(err, result) {
    if (err) {
      res.status(500).send('An error occurred getting all countries');
    } else {
      res.json(result.rows);
    }
  });
};

var one = function(req, res) {
  var code = req.params.code;
  countryDao.one(code, function(err, result) {
    if (err) {
      res.status(500).send('Could not get country by code: ' + code);
    } else {
      if (result.rows && result.rows.length === 0) {
        res.status(404).send('Cound not find country by code: ' + code);
      } else {
        res.json(result.rows);
      }
    }
  });
};

module.exports.all = all;
module.exports.one = one;