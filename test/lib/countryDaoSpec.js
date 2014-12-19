'use strict';

/*jshint expr: true*/

var expect = require('chai').expect;
var countryDao = require('../../lib/countryDao');

describe('Country DAO', function() {

  it('Finds all countries', function(done) {
    countryDao.all(function(err, result) {
      expect(err).to.be.null;
      expect(result.rows).to.have.length.above(10);
      done();
    });
  });

  it('Finds one country by code', function(done) {
    var code = 'MEX';
    countryDao.one(code, function(err, result) {
      expect(err).to.be.null;
      expect(result.rows).to.have.length(1);
      expect(result.rows[0].code).to.equal('MEX');
      expect(result.rows[0].name).to.equal('Mexico');
      done();
    });
  });

});