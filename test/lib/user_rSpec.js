'use strict';

/*jshint expr: true*/

var expect = require('chai').expect;
var userResource = require('../../lib/user_r');
var db = require('../../lib/database');

describe('User Resource', function() {

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


  describe('Find user permissions', function() {

    it('Returns a row when user has ability to perform an action on a resource', function(done) {
      var username = 'jdoe';
      var resource = 'country';
      var action = 'GET';
      userResource.findUserPermission(client, username, resource, action, function(err, result) {
        expect(err).to.be.null;
        expect(result.rows).to.have.length(1);
        expect(result.rows[0].username).to.equal('jdoe');
        expect(result.rows[0].resource).to.equal('country');
        expect(result.rows[0].action).to.equal('GET');
        done();
      });
    });

    it('Returns no rows when user does not have ability to perform an action on a resource', function(done) {
      var username = 'jdoe';
      var resource = 'country';
      var action = 'POST';
      userResource.findUserPermission(client, username, resource, action, function(err, result) {
        expect(err).to.be.null;
        expect(result.rows).to.have.length(0);
        done();
      });
    });

  });


});