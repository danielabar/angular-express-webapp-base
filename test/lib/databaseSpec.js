'use strict';

/*jshint expr: true*/

var expect = require('chai').expect;
var db = require('../../lib/database');
var async = require('async');

// This should be run only once per entire test suite - consider placing in a separate file
process.once('SIGUSR2', db.shutdown);

describe.only('Database', function() {

  var client;

  beforeEach(function(done) {
    db.getConnection(function(err, c) {
      expect(err).to.be.null;
      client = c;
      done();
    });
  });

  afterEach(function(done) {
    client.rollback(done);
  });

  it('Reads from the database', function(done) {
    var query = 'SELECT code, name FROM country WHERE name = $1';
    var params = ['Belgium'];
    client.query(query, params, function(err, result) {
      expect(err).to.be.null;
      expect(result.rows).to.have.length(1);
      expect(result.rows[0].code).to.equal('BEL');
      expect(result.rows[0].name).to.equal('Belgium');
      done();
    });
  });

  it('Calls back with error when invalid query is specified', function(done) {
    var invalidQuery = 'SELECT code, name FROM country WHERE foo = $1';
    var params = ['Belgium'];
    client.query(invalidQuery, params, function(err, result) {
      expect(err).not.to.be.null;
      expect(result).to.be.undefined;
      done();
    });
  });

  it('Processes multiple inserts', function(done) {
    var query1 = 'INSERT INTO country(code, name, continent, region, surfacearea, population, localname, governmentform, code2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    var values1 = ['TT1', 'test country 1', 'Europe', 'Caribbean', 1, 1, 'foo', 'foo', 'T1'];
    var query2 = 'INSERT INTO country(code, name, continent, region, surfacearea, population, localname, governmentform, code2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    var values2 = ['TT2', 'test country 2', 'Europe', 'Caribbean', 2, 2, 'foo', 'foo', 'T2'];
    var verifyQuery = 'SELECT code FROM country where code IN ($1, $2) ORDER BY code';
    var verifyValues = ['TT1', 'TT2'];

    async.waterfall([
      function(callback) {
        client.query(query1, values1, function(err, result) {
          expect(err).to.be.null;
          expect(result.rowCount).to.equal(1);
          callback(null, result);
        });
      },
      function(result, callback) {
        client.query(query2, values2, function(err, result) {
          expect(err).to.be.null;
          expect(result.rowCount).to.equal(1);
          callback(null, result);
        })
      },
      function(result, callback) {
        client.query(verifyQuery, verifyValues, function(err, result) {
          expect(err).to.be.null;
          expect(result.rows).to.have.length(2);
          expect(result.rows[0].code).to.equal('TT1');
          expect(result.rows[1].code).to.equal('TT2');
          callback(null, 'done');
        })
      }
    ], function(err, result) {
      expect(err).to.be.null;
      expect(result).to.equal('done');
      done();
    });
  });


});