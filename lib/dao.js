'use strict';

var pg = require('pg');

// TODO use process.env...
var conString = 'postgres://postgres:password@localhost:15432/myappdb';

var executeQuery = function(query, params, callback) {

  pg.connect(conString, function(err, client, done) {
    if(err) {
      // return console.error('error fetching client from pool', err);
      callback(err);
    }
    // client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    client.query(query, params, function(err, result) {
      console.log('dao.js found results: ' + JSON.stringify(result.rows));
      // TODO Is rows property always the right thing to return?
      callback(null, result.rows);
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        // return console.error('error running query', err);
        callback(err);
      }
      // console.log(result.rows[0].number);
      // callback(null, result);
      // return result.rows;
      //output: 1
    });
  });

};

module.exports.executeQuery = executeQuery;