'use strict';

var express = require('express');
var countryRoute = require('./country_r');
var router = express.Router();
var db = require('./database');

router.route('/country')
  .get(db.transactionMiddleware, function(req, res) {
    countryRoute.all(req.transaction, function(err, result) {
      if (err) {
        res.status(500).end();
      } else {
        res.status(200).send(result.rows);
      }
    });
  })
  // TODO Put this in waterfall and also query newly created country by code so we can return a meaningful response
  .post(db.transactionMiddleware, function(req, res) {
    // TODO run this through sanitizer/validator and return 400 if invalid
    var country = req.body;
    countryRoute.create(req.transaction, country, function(err, result) {
      if (err) {
        res.status(500).end();
      } else {
        res.status(201).send(result.rows[0].code);
      }
    });
  });
    // .put(countryApi.put)
    // .delete(countryApi.deleteCountry);

// router
//   .route('/country/:code')
//     .get(countryApi.one);

module.exports = router;