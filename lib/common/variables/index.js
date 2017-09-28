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
   * Returns all available functions
   *
   * @Return {Object} functions - functions data
   * @name this.sqz.variables.getFunctions
   */
  getFunctions(options) {
    let functions = {};

    if (_.has(options, 'deployReady')) {
      _.forEach(this.sqz.vars.functions, (functionObject, functionName) => {
        if (functionObject.deploy) {
          functions[functionName] = functionObject;
        }
      });
    } else {
      functions = this.sqz.vars.functions;
    }

    return functions;
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

  /**
   * Returns deployed app base url
   *
   * @Return {String} url - app base url
   * @name this.sqz.variables.getAppBaseUrl
   */
  getAppBaseUrl() {
    return this.sqz.vars.appBaseUrl;
  }

  /**
   * Returns in use cloud name
   *
   * @Return {String} cloud - cloud name
   * @name this.sqz.variables.getCloud
   */
  getCloud() {
    return this.sqz.vars.cloud;
  }
}

module.exports = Variables;
