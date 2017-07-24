process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const server = require('../index');
const mongoose = require('mongoose');
const data = require('../seed/data/users');
// const config = require('../config');
const saveTestData = require('../seed/users.seed');
// const db = config.DB[process.env.NODE_ENV] || process.env.DB;

describe('API Routes', function () {
  beforeEach(done => {
    mongoose.connection.dropDatabase()
      .then(() => saveTestData(data)
        .then(() => done())
        .catch(err => done(err))
      );
  });
  after(done => {
    mongoose.connection.close();
    done();
  });
});

describe('GET /api/', function () {
  it('responds with 200', function (done) {
    request(server)
      .get('/api/')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.body).to.equal('All good');
          done();
        }
      });
  });
});

describe('GET /api/users', function () {
  it('responds with 200', function (done) {
    request(server)
      .get('/api/users')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.statusCode).to.equal(200);
          expect(res.body.users).to.be.an('array');
          expect(res.body.users.length).to.equal(3);
          done();
        }
      });
  });
});

describe('GET /api/users/:username', function () {
  it('should return the requested user', function (done) {
    request(server)

      .get('/api/users/loneninja1')
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.statusCode).to.equal(200);
          expect(res.body.user).to.be.an('object');
          expect(res.body.user.level).to.equal(0);
          expect(res.body.user.username).to.equal('loneninja1');
          done();
        }
      });
  });
});

describe('GET /api/levels/:level', function () {
  it('should return all the questions for a given level', function (done) {
    request(server)
    .get('/api/levels/1')
    .end((err, res) => {
      if (err) done(err);
      else {
        expect(res.statusCode).to.equal(200);
        expect(res.body.levels).to.be.an('array');
        expect(res.body.levels.length).to.equal(5);
        done();
      }
    });
  });
});

describe('GET /api/levels/:level/:question', function () {
  it('should return the requested questions', function (done) {
    request(server)
      .get('/api/levels/0/0')
      .end((err, res) => {
        console.log(res.body);
        if (err) done(err);
        else {
          expect(res.statusCode).to.equal(200);
          expect(res.body.questionNumber).to.be.an('array');
          expect(res.body.questionNumber.length).to.equal(1);
          expect(res.body.questionNumber[0].title).to.equal('What\'s A String?');
          done();
        }
      });
  });
});
describe('PUT /api/users/:username', function () {
  it('should increase the users level', function (done) {
    request(server)
    .put('/api/users/loneninja2/level-up')
    .end((err, res) => {
      if (err) return done(err);
      expect(res.status).to.equal(202);
      expect(res.body.user.level).to.equal(1);
      done();
    });
  });
});
