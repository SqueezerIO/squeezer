/* eslint global-require: 0 */

'use strict';

const RunCommonLib = require('./common');
const colors       = require('colors');
const path         = require('path');
const fs           = require('fs');
const Promise      = require('bluebird');


/**
 * Class representing local function execution
 */
class Run {
  constructor(sqz) {
    this.sqz     = sqz;
    this.options = this.sqz.cli.params.get().options;
  }

  run(functionArg, eventArg) {
    return new Promise((resolve) => {
      const runCommon      = new RunCommonLib(this.sqz);
      const functionName   = this.options.function || functionArg;
      const data           = runCommon.findFunction(functionName);
      const projectPath    = this.sqz.vars.project.path;
      const eventInputFile = path.join(data.func.path, 'event.input.json');

      fs.writeFileSync(`${projectPath}/.build/development/response.json`, JSON.stringify({}));

      let eventInput;

      if (this.options.json) {
        eventInput = JSON.parse(JSON.stringify(this.options.json));
      } else if (this.options.path) {
        eventInput = JSON.parse(fs.readFileSync(this.options.path, 'utf8'));
      } else if (fs.existsSync(eventInputFile)) {
        eventInput = JSON.parse(fs.readFileSync(eventInputFile, 'utf8'));
      } else if (eventArg) {
        eventInput = eventArg;
      } else {
        eventInput = {};
      }

      this.sqz.cli.log.debug(
        `Executing function "${functionName}" on local environment`
      );

      this.loadEnv()
        .then(() => {
          const target = `${projectPath}/.build/development/functions/${data.func.identifier}`;

          if (!fs.existsSync(target)) {
            this.sqz.cli.log.error(`Function ${colors.blue.bold(data.func.name)} is not compiled !`);
          }

          fs.writeFileSync(eventInputFile, JSON.stringify(eventInput, null, 2), 'utf8');
          const executeCmds = this.sqz.yaml.parse(
            `${projectPath}/lib/hooks/commands/run/execute.function.yml`,
            {
              target         : path.normalize(target),
              handler        : data.func.handler,
              eventInputFile : eventInputFile,
              projectPath    : projectPath
            }
          );

          Promise.each(Object.keys(executeCmds), (key) => {
            const command = executeCmds[key];

            return this.sqz.command.run(command.description, command.bin, command.args || []);
          }).then(() => {
            const responseData = JSON.parse(fs.readFileSync(`${projectPath}/.build/development/response.json`));
            const response     = JSON.stringify(responseData.body, null, 2) || 'null';
            this.sqz.cli.log.console(`${colors.blue.bold('RESPONSE OUTPUT')}\n\n${response}\n`);
            resolve();
          });
        });
    });
  }

  loadEnv() {
    return new Promise((resolve) => {
      const runCommon = new RunCommonLib(this.sqz);

      runCommon.loadEnvVars().then(() => {
        process.env.MAIN_ASSETS_URL = `${process.env.APP_URL}/.build/development/assets/main`;
        resolve();
      });
    });
  }
}

module.exports = Run;
