'use strict';

/*jshint expr: true*/

var expect = require('chai').expect;
var countryResource = require('../../lib/country_r');
var db = require('../../lib/database');

describe('Country Resource', function() {

  var client;

  beforeEach(function(done) {
    db.getConnection(function(err, c) {
      expect(err).to.be.null;
      expect(c.commit).to.be.a('function');
      expect(c.rollback).to.be.a('function');
      client = c;
      done();
    });
  });

  afterEach(function(done) {
    client.rollback(done);
  });


  it('Creates a country', function(done) {
    var country = {
      code: 'AA1',
      name: 'Test Country 1',
      continent: 'Europe',
      region: 'Western Europe',
      code2: 'AA'
    };

    countryResource.create(client, country, function(err, insertResult) {
      expect(err).to.be.null;
      expect(insertResult.rowCount).to.equal(1);
      expect(insertResult.rows[0].code).to.equal('AA1');
      client.query('SELECT code FROM country where code = $1', ['AA1'], function(err, result) {
        expect(err).to.be.null;
        expect(result.rows).to.have.length(1);
        expect(result.rows[0].code).to.equal('AA1');
        done();
      });
    });
  });

});