'use strict';

const AWS = require('aws-sdk');
const Promise = require('bluebird');
const uuid = require('uuid');

const dynamoConfig = {
  sessionToken : process.env.AWS_SESSION_TOKEN,
  region       : process.env.AWS_REGION
};

const docClient    = new AWS.DynamoDB.DocumentClient(dynamoConfig);

const productsTable = process.env.PRODUCTS_TABLE;

/**
 * Class that represents products orchestration trough database
 */
class RestDB {
  /**
   * Adds a product to database
   *
   * @param {Object} product - product JSON object
   */
  add(item) {
    return new Promise((resolve, reject) => {
      item.id        = uuid.v4();
      item.createdAt = (new Date()).getTime();
      item.updatedAt = item.createdAt;

      const params = {
        TableName : productsTable,
        Item      : item
      };

      docClient.put(params, (err) => {
        if (err) return reject(err);
        return resolve(item);
      });
    });
  }

  /**
   * List all products from database
   *
   * @returns {Array}
   */
  list() {
    return new Promise((resolve, reject) => {
      const params = {
        TableName       : productsTable,
        AttributesToGet : [
          'id',
          'title',
          'category',
          'price',
          'createdAt',
          'updatedAt'
        ]
      };

      docClient.scan(params, (err, data) => {
        if (err) return reject(err);
        return resolve(data.Items);
      });
    });
  }

  /**
   * Get a specific product
   *
   * @param {Integer} id - product id
   * @returns {Object}
   */
  get(id) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName       : productsTable,
        Key             : {
          id : id
        },
        AttributesToGet : [
          'id',
          'title',
          'category',
          'price',
          'createdAt',
          'updatedAt'
        ]
      };

      docClient.get(params, (err, data) => {
        if (err) return reject(err);
        return resolve(data.Item || {});
      });
    });
  }

  /**
   * Removes a product from database
   *
   * @param {Integer} id - product id
   */
  remove(id) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName : productsTable,
        ReturnValues     : 'ALL_OLD',
        Key       : {
          id : id
        }
      };

      docClient.delete(params, (err, data) => {
        if (err) return reject(err);
        return resolve(data.Attributes);
      });
    });
  }

  /**
   * Update a specific product on database
   *
   * @param {Integer} id - product id
   */
  update(id, item) {
    const attributeUpdates = Object.keys(item).reduce((curr, key) => {
      const val = item[key];

      curr[key] = {
        Action : 'PUT',
        Value  : val
      };

      return curr;
    }, {});

    attributeUpdates.updatedAt = {
      Action : 'PUT',
      Value  : (new Date()).getTime()
    };

    return new Promise((resolve, reject) => {
      const params = {
        TableName        : productsTable,
        AttributeUpdates : attributeUpdates,
        ReturnValues     : 'ALL_NEW',
        Key              : {
          id : id
        }
      };

      docClient.update(params, (err, data) => {
        if (err) return reject(err);

        return resolve(data.Attributes);
      });
    });
  }
}

module.exports = RestDB;
