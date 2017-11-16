'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const CompileFunctions = require('../../functions/lib/compile');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const Provider = require('squeezer-provider-node');

class Compile {
  constructor(sqz) {
    this.sqz = sqz;
    this.options = this.sqz.cli.params.get().options;
  }

  run() {
    return new Promise((resolve) => {
      const compileFunctions = new CompileFunctions(this.sqz);
      let compileType = 'development' || this.options.cloud;

      let stage = this.options.stage;

      if (_.has(this.options, 'cloud')) {
        compileType = 'cloud';

        if (stage === 'local') {
          stage = 'dev';
        }
      }

      fsExtra.ensureDirSync(path.join(this.sqz.vars.project.path, '.build', compileType));

      this.sqz.cli.log.debug('Building staging vars');
      this.buildMainVars(stage, compileType).then((mainVars) => {
        this.buildFunctionsVars(mainVars);

        compileFunctions.compile(compileType, stage).then(() => {
          this.sqz.cli.log.info('Compiled !');
          resolve();
        });
      });
    });
  }

  buildMainVars(stage, compileType) {
    return new Promise((resolve) => {
      const projectVars = this.sqz.vars.project.vars;
      const config = this.sqz.config.data;
      const projectPath = this.sqz.vars.project.path;
      const mainVarsPath = path.join(projectPath, '.build', compileType, '.vars.json');

      let vars = {
        name: this.sqz.vars.project.name,
        identifier : this.sqz.vars.project.identifier,
        path: this.sqz.vars.project.path,
        stage: stage,
        config: this.sqz.config.data,
        provider: compileType === 'development' ? 'local' : config.provider,
        runtime : this.sqz.vars.project.runtime,
        runtimeVersion : this.sqz.vars.project.runtimeVersion
      };

      const buildVolatileVars = () => {
        const volatileVars = {};

        return new Promise((volatileResolve) => {
          if (compileType === 'development') {
            _.assign(volatileVars, {
              appBaseUrl: 'http://localhost:4001',
              storageBaseUrl: 'http://localhost:4001/.build'
            });

            volatileResolve(volatileVars);
          } else if (compileType === 'cloud') {
            const provider = new Provider(vars).init();

            this.sqz.cli.log.info('Deploying cloud base resources');
            this.sqz.cli.loader.start();
            provider.utils.deployBaseResources().then(() => {
              this.sqz.cli.loader.stop();
              provider.utils.getAppBaseUrl().then((appBaseUrl) => {
                provider.utils.getStorageBaseUrl().then((storageBaseUrl) => {
                  _.assign(volatileVars, {
                    appBaseUrl: appBaseUrl,
                    storageBaseUrl: storageBaseUrl
                  });
                  volatileResolve(volatileVars);
                });
              });
            });
          }
        });
      };

      buildVolatileVars().then((volatileVars) => {
        _.assign(vars, volatileVars);

        vars = _.merge(vars, _.omit(projectVars, ['stages']));
        vars = _.merge(vars, projectVars.stages[stage]);

        fs.writeFileSync(mainVarsPath, JSON.stringify(vars, null, 2));

        resolve(vars);
      });
    });
  }

  buildFunctionsVars(vars) {
    const functions = this.sqz.vars.functions;

    _.forEach(functions, (functionObject) => {
      const funcVars = _.assign(vars, {
        function: functionObject
      });

      fs.writeFileSync(
        path.join(functionObject.path, 'src', '.vars.json'),
        JSON.stringify(funcVars, null, 2)
      );
    });
  }
}

module.exports = Compile;
