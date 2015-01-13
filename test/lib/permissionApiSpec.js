'use strict';

/*jshint expr: true*/

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../../app');

// Given temporarily hard-coded injected user in request, this can only test permissions on that user
describe('Permission API', function() {

  it('GET /cando returns true for user having access to a resource and verb', function(done) {
    var resource = 'country';
    var verb = 'POST';
    var result;
    request(app)
      .get('/permission/cando/' + resource + '/' + verb)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        result = JSON.parse(res.text);
        expect(result.canDo).to.be.true;
        done();
      });
  });

  it('GET /cando returns false for user not having access to a resource and verb', function(done) {
    var resource = 'country';
    var verb = 'PATCH';
    var result;
    request(app)
      .get('/permission/cando/' + resource + '/' + verb)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        result = JSON.parse(res.text);
        expect(result.canDo).to.be.false;
        done();
      });
  });

  it('GET /ismember returns true for user belong to a group', function(done) {
    var group = 'ADMIN';
    var result;
    request(app)
      .get('/permission/ismember/' + group)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        result = JSON.parse(res.text);
        expect(result.isMember).to.be.true;
        done();
      });
  });

  it('GET /ismember returns false for user not belonging to a group', function(done) {
    var group = 'MANAGER';
    var result;
    request(app)
      .get('/permission/ismember/' + group)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        result = JSON.parse(res.text);
        expect(result.isMember).to.be.false;
        done();
      });
  });

});