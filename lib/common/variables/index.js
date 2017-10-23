'use strict';

const _ = require('lodash');

/**
 * Class that manages global CLI variables
 */
class Variables {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Returns all available variables
   *
   * @Return {String} variables - all variables
   * @name this.sqz.variables.get
   */
  get() {
    return this.sqz.vars;
  }

  /**
   * Returns current selected stage
   *
   * @Return {String} stage - stage value
   * @name this.sqz.variables.getStage
   */
  getStage() {
    return this.sqz.vars.stage;
  }

  /**
   * Returns current selected region
   *
   * @Return {String} region - region value
   * @name this.sqz.variables.getRegion
   */
  getRegion() {
    return this.sqz.vars.region;
  }

  /**
   * Returns project config variables
   *
   * @Return {Object} project - project data
   * @name this.sqz.variables.getProject
   */
  getProject() {
    return this.sqz.vars.project;
  }

  /**
   * Returns project's hooks
   *
   * @Return {Object} hooks - hooks data
   * @name this.sqz.variables.getHooks
   */
  getHooks() {
    return this.sqz.vars.hooks;
  }
}

module.exports = Variables;
