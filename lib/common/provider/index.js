'use strict';

const _ = require('lodash');

class Provider {
  constructor(sqz) {
    this.sqz = sqz;
    this.outputs = {};
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    if (!this.name) {
      this.sqz.cli.log.error('No provider name configure');
    }

    return this.name;
  }

  setAppBaseUrl(url) {
    this.appBaseUrl = url;
  }

  getAppBaseUrl() {
    if (!this.appBaseUrl) {
      this.sqz.cli.log.error('No app base url configured');
    }

    return this.appBaseUrl;
  }

  addOutput(key, val) {
    this.outputs[key] = val;
  }

  getOutput(key) {
    if (!_.has(this.outputs, key)) {
      this.sqz.cli.log.error(`There is not output with name "${key}" available`);
    }
  }
}

module.exports = Provider;
