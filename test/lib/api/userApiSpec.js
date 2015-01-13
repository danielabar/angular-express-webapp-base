'use strict';

/*jshint expr: true*/

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../../../app');

describe('User API', function() {

  it('GET /user returns all users', function(done) {
    var result;
    request(app)
      .get('/api/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        result = JSON.parse(res.text);
        expect(result).to.have.length.above(0);
        done();
      });
  });

});