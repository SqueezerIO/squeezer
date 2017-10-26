'use strict';

const cfg = require('home-config').load('.sqzrc');
const _ = require('lodash');

/**
 * Class that manages project's configuration
 */
class Config {
  constructor(sqz) {
    this.sqz = sqz;
    this.data = cfg.getAll();

    this.data = {};

    const data = cfg.getAll();

    const projectName = this.sqz.vars.project.name;

    if (_.has(data, projectName)) {
      this.data = data[projectName];
    }
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
    return this.data[setting];
  }
}

module.exports = Config;
