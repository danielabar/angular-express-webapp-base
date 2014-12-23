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
  .post(function(req, res) {
    res.status(500).end();
  });
    // .put(countryApi.put)
    // .delete(countryApi.deleteCountry);

// router
//   .route('/country/:code')
//     .get(countryApi.one);

module.exports = router;