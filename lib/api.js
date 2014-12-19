'use strict';

var express = require('express');
var countryDao = require('./countryDao');
var router = express.Router();

router
  .route('/country')
    .get(function(req, res) {
      countryDao.all(function(err, result) {
        if (err) {
          res.send(500, 'Could not get countries');
        } else {
          res.json(result.rows);
        }
      });
    });

module.exports = router;