'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

class Test {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      this.getFunctions().then((functions) => {
        if (functions.length === 0) {
          this.sqz.cli.log.info('No functions available for testing');
        }
        Promise.each(functions, (functionObj) => {
          return this.runTests(functionObj);
        }).then(() => {
          this.sqz.cli.log.info('Done!');
          resolve();
        });
      });
    });
  }

  getFunctions() {
    const projectPath = this.sqz.vars.project.path;
    const testFunctions = [];
    const options = this.sqz.cli.params.get().options;

    return new Promise((resolve) => {
      if (_.has(options, 'smart')) {
        const mainVarsPath = path.join(projectPath, '.build', 'cloud', '.vars.json');

        if (!fs.existsSync(mainVarsPath)) {
          this.sqz.cli.log.error(
            `You need to cloud compile your project before running tests : "${colors.blue.bold('sqz compile --cloud --stage STAGE_NAME')}"`
          );
        }

        const vars = JSON.parse(fs.readFileSync(mainVarsPath, 'utf8'));

        this.sqz.checksums.compile('cloud', vars.stage).then(() => {
          const functions = this.sqz.vars.functions;
          _.forEach(functions, (functionObj) => {
            if (functionObj.changed && functionObj.tests) {
              testFunctions.push(functionObj);
            }
          });

          resolve(testFunctions);
        });
      } else {
        const functions = this.sqz.vars.functions;

        _.forEach(functions, (functionObj) => {
          if (functionObj.flagged && functionObj.tests) {
            testFunctions.push(functionObj);
          }
        });

        resolve(testFunctions);
      }
    });
  }

  runTests(functionObj) {
    const projectPath = this.sqz.vars.project.path;

    this.sqz.cli.log.info(`Running tests against function "${colors.blue.bold(functionObj.name)}"`);

    return new Promise((resolve) => {
      Promise.each(functionObj.tests, (testFile) => {
        const testCmdHook = path.join(projectPath, 'lib', 'hooks', 'commands', 'test', 'function.yml');
        const testCommands = this.sqz.yaml.parse(testCmdHook, {
          project : this.sqz.vars.project,
          testFile : path.join(functionObj.path, testFile)
        });
        return this.sqz.command.bulk(testCommands);
      }).then(() => {
        resolve();
      });
    });
  }
}

module.exports = Test;
