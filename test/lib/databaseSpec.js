'use strict';

/*jshint expr: true*/

var expect = require('chai').expect;
var db = require('../../lib/database');

describe('Database Access', function() {

  it('Reads from the database', function(done) {
    var query = 'SELECT code, name FROM country WHERE name = $1::text';
    var params = ['Belgium'];
    db.query(query, params, function(err, result) {
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
    db.query(invalidQuery, params, function(err, result) {
      expect(err).not.to.be.null;
      expect(result).to.be.undefined;
      done();
    });
  });

  describe('Transaction support', function() {

    it('Processes multiple inserts successfully', function(done) {
      var queriesAndValues = [
        {
          query: 'INSERT INTO country(code, name, continent, region, surfacearea, population, localname, governmentform, code2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          values: ['TT1', 'test country 1', 'Europe', 'Caribbean', 1, 1, 'foo', 'foo', 'T1']
        },{
          query: 'INSERT INTO country(code, name, continent, region, surfacearea, population, localname, governmentform, code2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          values: ['TT2', 'test country 2', 'Europe', 'Caribbean', 2, 2, 'foo', 'foo', 'T2']
        }
      ];
      db.transaction(queriesAndValues, function(err, result) {
        expect(err).to.be.null;
        db.rollback(result.client, result.done, function(err) {
          expect(err.message).to.equal('Transaction rolled back');
          done();
        });
      });
    });

    it('Unique constsraint violation causes transaction to rollback', function(done) {
      var test1Data = {
        query: 'INSERT INTO country(code, name, continent, region, surfacearea, population, localname, governmentform, code2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        values: ['TT3', 'test country 3', 'Europe', 'Caribbean', 3, 3, 'foo', 'foo', 'T3']
      };
      var queriesAndValues = [test1Data, test1Data];
      db.transaction(queriesAndValues, function(err) {
        expect(err.message).to.equal('Transaction rolled back');
        done();
      });
    });

  });

});