/* eslint global-require: 0 */

'use strict';

const RunCommonLib = require('./common');
const colors       = require('colors');
const path         = require('path');
const fs           = require('fs');
const Promise      = require('bluebird');

/**
 * Class representing AWS Lambda local run
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
      const eventInputFile = `${data.microservice.path}/event.input.json`;

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
        `Executing function ${colors.blue.bold(functionName)} on local environment`
      );

      this.loadEnv(data.microservice)
        .then(() => {
          const target = `${projectPath}/.build/development/microservices/${data.microservice.identifier}`;

          if (!fs.existsSync(target)) {
            this.sqz.cli.log.error(`Microservice ${colors.blue.bold(data.microservice.name)} is not compiled !`);
          }

          fs.writeFileSync(eventInputFile, JSON.stringify(eventInput), 'utf8');
          const executeCmds = this.sqz.yaml.parse(
            `${projectPath}/lib/hooks/commands/run/execute.function.yml`,
            {
              microservice   : data.microservice,
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
            const response = JSON.parse(fs.readFileSync(`${projectPath}/.build/development/response.json`));
            this.sqz.cli.log.console(`${colors.green.bold('RESPONSE OUTPUT')}\n\n${response.body || 'null'}\n`);
            resolve();
          });
        });
    });
  }

  loadEnv(microservice) {
    return new Promise((resolve) => {
      const cloud = this.sqz.vars.project.cloud;

      const CloudRunCommon = require(`../../${cloud.name}/lib/run/lib/common`);
      const cloudRunCommon = new CloudRunCommon(this.sqz);

      cloudRunCommon.loadEnvVars(microservice).then(() => {
        process.env.MAIN_ASSETS_URL = 'http://localhost:4001/.build/development/assets/main';
        process.env.ASSETS_URL      = `http://localhost:4001/.build/development/assets/microservices/${microservice.identifier}`;
        resolve();
      });
    });
  }
}

module.exports = Run;
