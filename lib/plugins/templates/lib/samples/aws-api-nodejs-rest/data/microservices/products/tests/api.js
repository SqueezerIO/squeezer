'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const API_URL = process.env.APP_URL;

chai.use(chaiHttp);

describe('Running Products API tests', () => {
  const item = {
    title    : 'TV LED',
    category : 'electronics',
    price    : 500
  };

  const modifiedItem = {
    title    : 'TV LED 4k',
    category : 'electronics & television',
    price    : 600
  };

  let itemId;

  it('add an item', () => {
    return chai.request(API_URL)
      .post('/rest/v1/products')
      .send(item)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data)
          .to.be.an('object')
          .to.include.keys('id');
        itemId = res.body.data.id;
      });
  });

  it('list all items', () => {
    return chai.request(API_URL)
      .get('/rest/v1/products')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data)
          .to.be.an('array')
          .to.have.length.of.at.least(1);
      });
  });

  it('get an item by id', () => {
    return chai.request(API_URL)
      .get(`/rest/v1/products/${itemId}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data)
          .to.be.an('object')
          .to.include.keys('id');
      });
  });

  it('update an item', () => {
    return chai.request(API_URL)
      .put(`/rest/v1/products/${itemId}`)
      .send(modifiedItem)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.price)
                .to.equal(modifiedItem.price);
      });
  });

  it('remove an item', () => {
    return chai.request(API_URL)
      .delete(`/rest/v1/products/${itemId}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.id)
                .to.equal(itemId);
      });
  });
});
