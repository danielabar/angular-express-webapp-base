'use strict';

var express = require('express');
var countryApi = require('./countryApi');
var router = express.Router();

router
  .route('/country')
    .get(countryApi.all)
    .post(countryApi.create);

router
  .route('/country/:code')
    .get(countryApi.one);

module.exports = router;