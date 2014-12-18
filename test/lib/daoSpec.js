'use strict';
/*jshint expr: true*/

var expect = require('chai').expect;
var dao = require('../../lib/dao');

describe('Dao', function() {

  it('Reads from the database', function(done) {
    var query = 'SELECT code, name FROM country WHERE name = $1::text';
    var params = ['Belgium'];
    var result = dao.executeQuery(query, params, function(err, result) {
      expect(result).to.have.length(1);
      expect(result[0].code).to.equal('BEL');
      expect(result[0].name).to.equal('Belgium');
      done();
    });
  });

});