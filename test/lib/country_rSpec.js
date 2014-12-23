'use strict';

/*jshint expr: true*/

var expect = require('chai').expect;
var sinon = require('sinon');
var countryResource = require('../../lib/country_r');
var db = require('../../lib/database');

describe('Country Resource', function() {

  var client;
  beforeEach(function(done) {
    // Get a real connection and make commit a no-op
    db.getConnection(function(err, c) {
      client = c;
      client.commit = function(callback) {
        callback(null);
      };
      done();
    });
  });

  afterEach(function(done) {
    client.rollback(done);
  });

  describe('Create', function() {

    it('Success', function(done) {
      var country = {
        code: 'AA1',
        name: 'Test Country 1',
        continent: 'Europe',
        region: 'Western Europe',
        code2: 'AA'
      };

      // A stubbed out client with no-op commit
      var dbStub = sinon.stub(db, 'getConnection', function(done) {
        console.log('test returning stubbed out client');
        done(null, client);
      });

      // TODO Put this in async waterfall
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

});