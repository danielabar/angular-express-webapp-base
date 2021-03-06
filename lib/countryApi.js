'use strict';

var countryResource = require('./country_r');

module.exports = {

  all: function(req, res) {
    countryResource.all(function(err, result) {
      if (err) {
        res.status(500).send('An error occurred getting all countries');
      } else {
        res.json(result.rows);
      }
    });
  },

  create: function(req, res) {
    var country = req.body;   // TODO Server side sanitizing and validation before passing client data to be persisted
    countryResource.create(country, function(err) {
      if (err) {
        res.status(500).send('An error occurred creating country');
      } else {
        res.status(201).end();
      }
    });
  }

};

// var one = function(req, res) {
//   var code = req.params.code;
//   countryDao.one(code, function(err, result) {
//     if (err) {
//       res.status(500).send('Could not get country by code: ' + code);
//     } else {
//       if (result.rows && result.rows.length === 0) {
//         res.status(404).send('Cound not find country by code: ' + code);
//       } else {
//         res.json(result.rows);
//       }
//     }
//   });
// };

// var put = function(req, res) {
//   res.status(501).send('Update all countries not implemented');
// };

// var deleteCountry = function(req, res) {
//   res.status(501).send('Delete all countries not implemented');
// };