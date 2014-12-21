'use strict';

/*jshint expr: true*/

var expect = require('chai').expect;
var dao = require('../../lib/dao');

describe('Dao', function() {

  it('Reads from the database', function(done) {
    var query = 'SELECT code, name FROM country WHERE name = $1::text';
    var params = ['Belgium'];
    dao.query(query, params, function(err, result) {
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
    dao.query(invalidQuery, params, function(err, result) {
      expect(err).not.to.be.null;
      expect(result).to.be.undefined;
      done();
    });
  });

  // TODO: use async to loop > poolsize times with errors then a success to verify error handling is releasing connections

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
      dao.transaction(queriesAndValues, function(err, result) {
        expect(err).to.be.null;
        expect(result).to.equal('Transaction completed successfully');
        done();
      });
    });

  });

});