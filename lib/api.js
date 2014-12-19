'use strict';

var express = require('express');
var countryApi = require('./countryApi');
var router = express.Router();

router
  .route('/country')
    .get(countryApi.all);

module.exports = router;