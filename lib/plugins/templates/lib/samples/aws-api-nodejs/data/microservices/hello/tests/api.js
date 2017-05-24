'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const API_URL = process.env.APP_URL;

chai.use(chaiHttp);

describe('Running API tests', () => {
  it('get hello text', () => {
    return chai.request(API_URL)
      .get('/rest/v1/hello')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data)
          .to.be.an('object')
          .to.include.keys('text');
        expect(res.body.data.text)
          .to.equal('Hello World!');
      });
  });
});
