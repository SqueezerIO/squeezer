'use strict';

const Promise = require('bluebird');
const request = require('request');
const colors = require('colors');

class Key {
  constructor(sqz) {
    this.sqz = sqz;
  }

  get() {
    const apiBaseUrl = this.sqz.vars.apiBaseUrl;
    const endpoint = `${apiBaseUrl}/rest/v1/deployment/generate/key`;

    this.sqz.cli.log.info('Generating a new deployment access key');
    return new Promise((resolve, reject) => {
      request.get(endpoint, { json: true }, (error, response, body) => {
        if (!error && response.statusCode === 200 && body.message === 'success') {
          const key = body.data.key;

          this.sqz.cli.log.info(`Add the new key : "${colors.blue.bold(`sqz config --setting key --value ${key}`)}"`);

          resolve();
        } else if (body && body.message) {
          reject(body.message);
        } else if (error) {
          reject(error);
        } else {
          reject('Cannot retrieve a deployment key');
        }
      });
    });
  }
}

module.exports = Key;
