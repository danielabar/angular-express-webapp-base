'use strict';

// TODO Rename this file countryApi.js

var express = require('express');
var countryRoute = require('./country_r');
var router = express.Router();
var db = require('./database');
var async = require('async');
var authorization = require('./middleware/authorization');

// Temporarily inject an authenticated user until actual user authentication strategy is implemented
router
  /*jshint unused: false*/
  .use(function(req, res, next) {
    if (!req.user) {
      req.user = {username: 'bsmith'};
    }
    next();
  });

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
  .post(db.transactionMiddleware, authorization.userCanCreateCountry, function(req, res) {
    var country = req.body;   // TODO run this through sanitizer/validator and return 400 if invalid
    async.waterfall([
      function(next){
        countryRoute.create(req.transaction, country, function(err, result) {
          if(err) {next(err); }
          else{
            next(null, req.transaction, result.rows[0].code);
          }
        });
      },
      function(transaction, code, next){
        countryRoute.findByCode(transaction, code, function(err, countriesByCode) {
          if(err) {next(err); }
          else{
            next(null, countriesByCode.rows[0]);
          }
        });
      }
    ], function (err, createdCountry) {
       if (err) {
         res.status(500).end();
       } else {
         res.status(201).send(createdCountry);
       }
    });
  })
  .put(function(req, res) {
    res.status(501).end();
  })
  .delete(function(req, res) {
    res.status(501).end();
  });

router.route('/country/:id')
  .get(db.transactionMiddleware, function(req, res) {
    countryRoute.findByCode(req.transaction, req.params.id, function(err, result) {
      if (err) { res.status(500).end(); }
      else if (result.rows.length === 0) { res.status(404).end(); }
      else { res.status(200).send(result.rows); }
    });
  })
  .post(function(req, res) {
    res.status(501).end();
  })
  .put(db.transactionMiddleware, function(req, res) {
    var country = req.body;   // TODO run this through sanitizer/validator and return 400 if invalid
    async.waterfall([
      function(next){
        countryRoute.updateByCode(req.transaction, req.params.id, country, function(err) {
          if(err) {next(err); }
          else{
            next(null, req.transaction, req.params.id);
          }
        });
      },
      function(transaction, code, next){
        countryRoute.findByCode(transaction, code, function(err, result) {
          if(err) {next(err); }
          else{
            next(null, result);
          }
        });
      }
    ], function (err, result) {
       if (err) {
         res.status(500).end();
       } else {
         res.status(200).send(result.rows);
       }
    });
  })
  .delete(db.transactionMiddleware, function(req, res) {
    res.status(501).end();
  });

module.exports = router;