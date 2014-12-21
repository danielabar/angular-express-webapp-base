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

});