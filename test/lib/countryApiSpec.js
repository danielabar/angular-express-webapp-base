'use strict';

/*jshint expr: true*/

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../../app');

describe('Country API', function() {

  it('GET /country returns all countries', function(done) {
    var result;
    request(app)
      .get('/api/country')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        result = JSON.parse(res.text);
        expect(result).to.have.length.above(100);
        done();
      });
  });

  it('POST /country inserts a new country', function(done) {
    var result;
    var country = {
      code: 'BB1',
      name: 'Test Country BB1',
      continent: 'Europe',
      region: 'Western Europe',
      code2: 'B1'
    };
    request(app)
      .post('/api/country')
      .set('Accept', 'application/json')
      .send(country)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
         expect(res.statusCode).to.equal(201);
         result = JSON.parse(res.text);
         expect(result[0].code).to.equal('BB1');
         expect(result[0].name).to.equal('Test Country BB1');
         expect(result[0].continent).to.equal('Europe');
         done();
      });
  });

  // it('PUT /country returns not implemented error', function(done) {
  //   request(app)
  //     .put('/api/country')
  //     .set('Accept', 'application/json')
  //     .expect(501, done);
  // });

});