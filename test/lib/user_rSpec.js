'use strict';

/*jshint expr: true*/
/*jshint camelcase: false*/

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


  describe('Find user permission', function() {

    it('Returns a row when user has ability to perform an action on a resource', function(done) {
      var username = 'jdoe';
      var resource = 'country';
      var action = 'GET';
      userResource.findUserPermission(client, username, resource, action, function(err, result) {
        expect(err).to.be.null;
        expect(result.rows).to.have.length(1);
        expect(result.rows[0].username).to.equal(username);
        expect(result.rows[0].resource).to.equal(resource);
        expect(result.rows[0].action).to.equal(action);
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

  describe('Find user group', function() {

    it('Returns a row when user belongs to group', function(done) {
      var username = 'bsmith';
      var groupName = 'ADMIN';
      userResource.findUserGroup(client, username, groupName, function(err, result) {
         expect(err).to.be.null;
        expect(result.rows).to.have.length(1);
        expect(result.rows[0].username).to.equal(username);
        expect(result.rows[0]['group_name']).to.equal(groupName);
        done();
      });
    });

    it('Returns no rows when user does not belong to group', function(done) {
      var username = 'jdoe';
      var groupName = 'ADMIN';
      userResource.findUserGroup(client, username, groupName, function(err, result) {
        expect(err).to.be.null;
        expect(result.rows).to.have.length(0);
        done();
      });
    });

    it('Returns no rows when given invalid input', function(done) {
      var username = 5;
      var groupName = NaN;
      userResource.findUserGroup(client, username, groupName, function(err, result) {
        expect(err).to.be.null;
        expect(result.rows).to.have.length(0);
        done();
      });
    });

  });

  describe('Find all users', function() {

    it('Returns rows for each user', function(done) {
      userResource.all(client, function(err, result) {
        expect(err).to.be.null;
        expect(result.rows).to.have.length.above(0);
        result.rows.forEach(function(row) {
          expect(row).to.have.ownProperty('user_id');
          expect(row).to.have.ownProperty('username');
          expect(row).to.have.ownProperty('email');
          expect(row).to.have.ownProperty('first_name');
          expect(row).to.have.ownProperty('last_name');
        });
        done();
      });
    });

  });

});