'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const CompileFunctions = require('../../functions/lib/compile');
const fs = require('fs');
const path = require('path');

/**
 * Class that represents deployment
 */
class Compile {
  constructor(sqz) {
    this.sqz = sqz;
    this.options = this.sqz.cli.params.get().options;
  }

  run() {
    return new Promise((resolve) => {
      const compileFunctions = new CompileFunctions(this.sqz);
      let compileType = 'development' || this.options.cloud;
      if (_.has(this.options, 'cloud')) {
        compileType = 'cloud';
      }

      this.sqz.cli.log.debug('Building staging vars');
      this.buildVars(this.options.stage, compileType);

      compileFunctions.compile(compileType).then(() => {
        this.sqz.cli.log.info('Compiled !');
        resolve();
      });
    });
  }

  buildVars(stage, compileType) {
    const projectVars = this.sqz.vars.project.vars;

    let vars = {
      stage: stage,
      provider: compileType === 'development' ? 'local' : this.sqz.vars.provider,
      path : this.sqz.vars.project.path
    };

    vars = _.merge(vars, _.omit(projectVars, ['stages']));
    vars = _.merge(vars, projectVars.stages[stage]);

    const functions = this.sqz.vars.functions;

    _.forEach(functions, (functionObject) => {
      const funcVars = _.assign(vars, {
        function: functionObject
      });

      fs.writeFileSync(path.join(functionObject.path, 'src', 'vars.json'), JSON.stringify(funcVars, null, 2));
    });
  }
}

module.exports = Compile;
