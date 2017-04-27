'use strict';

const cfg = require('home-config').load('.sqzrc');
const _   = require('lodash');

/**
 * Class that manages project's configuration
 */
class Config {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Configure a setting
   *
   * @param {string} setting - setting name
   * @param {string} setting - setting value
   *
   * @name this.sqz.config.set
   */
  set(setting, value) {
    const data = cfg.getAll();

    if (!_.has(data, this.sqz.vars.project.name)) {
      cfg[this.sqz.vars.project.name] = {};
    }

    cfg[this.sqz.vars.project.name][setting] = value;

    cfg.save();
  }

  /**
   * Retrieve a setting
   *
   * @param {string} setting - setting name
   *
   * @returns {Object}
   *
   * @name this.sqz.config.get
   */
  get(setting) {
    const data = cfg.getAll();

    if (_.has(data, this.sqz.vars.project.name)) {
      return data[this.sqz.vars.project.name][setting];
    }

    return null;
  }
}

module.exports = Config;
