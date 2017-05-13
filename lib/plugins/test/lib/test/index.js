/* eslint-disable global-require */

'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const colors  = require('colors');
const fs      = require('fs-extra');
const path    = require('path');
const spawn   = require('child_process').spawn;

let seleniumChild = {};

class TestRun {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise(() => {
      this.startSelenium().then(() => {
        Promise.each(_.keys(this.sqz.vars.microservices), (key) => {
          const microservice = this.sqz.vars.microservices[key];
          if (fs.existsSync(`${microservice.path}/sqz.tests.yml`) && microservice.enabled) {
            this.sqz.cli.log.info(
              `Running tests on microservice ${colors.blue.bold(microservice.name)}`
            );

            return this.runTest(microservice);
          }

          return true;
        }).then(() => {
          if (seleniumChild.pid) process.kill(-seleniumChild.pid);
          process.exit(0);
        });
      });
    });
  }

  runTest(microservice) {
    return new Promise((resolve) => {
      const projectPath = this.sqz.vars.project.path;
      const cloud       = this.sqz.vars.project.cloud;

      const tests = this.sqz.yaml.parse(`${microservice.path}/sqz.tests.yml`);

      const CloudRunCommon = require(`../../../${cloud.name}/lib/run/lib/common`);
      const cloudRunCommon = new CloudRunCommon(this.sqz);

      cloudRunCommon.loadEnvVars(microservice).then(() => {
        Promise.each(_.keys(tests), (key) => {
          const testFile = tests[key];
          const source   = `${microservice.path}/tests/${testFile}`;

          // const source    = `${data.microservice.buildPath}/src/handler.js`;
          // const output    = `${data.microservice.buildPath}/target/handler.js`;
          const commands = this.sqz.yaml.parse(
            `${projectPath}/lib/hooks/commands/test/execute.yml`,
            {
              source      : path.normalize(source),
              projectPath : projectPath
            }
          );

          return Promise.each(Object.keys(commands), (cmdKey) => {
            const command = commands[cmdKey];

            return this.sqz.command.run(command.description, command.bin, command.args || []);
          });
        }).then(() => {
          resolve();
        });
      });
    });
  }

  startSelenium() {
    return new Promise((resolve) => {
      if (this.sqz.vars.project.type === 'web') {
        this.sqz.cli.log.info(`Starting ${colors.blue.bold('Selenium')} server`);
        seleniumChild = spawn('selenium-standalone', ['start'], {
          detached : true
        });
        setTimeout(() => {
          resolve();
        }, 2000);
      } else {
        resolve();
      }
    });
  }
}

module.exports = TestRun;
