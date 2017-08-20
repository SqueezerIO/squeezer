'use strict';

const _       = require('lodash');
const colors  = require('colors');
const fs      = require('fs');

const CommonArchiver  = require('../lib/common/archiver');
const CommonYaml      = require('../lib/common/yaml');
const CommonCommand   = require('../lib/common/command');
const CommonCliError  = require('../lib/common/cli/error');
const CommonCliLoader = require('../lib/common/cli/loader');
const CommonCliLog    = require('../lib/common/cli/log');
const CommonCliParams = require('../lib/common/cli/params');
const CommonCliHelp   = require('../lib/common/cli/help');
const CommonUtils     = require('../lib/common/utils');
const CommonLifecycle = require('../lib/common/lifecycle');
const CommonVariables = require('../lib/common/variables');
const CommonVersion   = require('../lib/common/version');
const CommonConfig    = require('../lib/common/config');
const CommonValidate  = require('../lib/common/validate');
const CommonChecksums = require('../lib/common/checksums');

class Squeezer {
  init() {
    this.cli       = {
      params : new CommonCliParams(this),
      error  : new CommonCliError(this),
      loader : new CommonCliLoader(this),
      log    : new CommonCliLog(this),
      help   : new CommonCliHelp(this)
    };
    this.utils     = new CommonUtils(this);
    this.yaml      = new CommonYaml(this);
    this.lifecycle = new CommonLifecycle(this);
    this.command   = new CommonCommand(this);
    this.variables = new CommonVariables(this);
    this.archive   = new CommonArchiver(this);
    this.version   = new CommonVersion(this);
    this.config    = new CommonConfig(this);
    this.validate  = new CommonValidate(this);
    this.checksums = new CommonChecksums(this);

    this.deploy = {};
    this.cloud  = {};

    this.vars = {
      project       : {},
      microservices : {},
      hooks         : [],
      apiBaseUrl    : 'https://api.squeezer.io',
      stage         : 'dev',
      assets        : {
        main          : {
          previousChecksum : null,
          currentChecksum  : null
        },
        microservices : [],
        uploadPaths   : []
      }
    };

    if (process.argv[2] === 'deploy') {
      this.vars.deploy = true;
    }

    this.validateVersion();
    this.loadProject();
    this.loadHooks();
  }

  loadProject() {
    this.vars.project.isValid = false;

    const splitPath = process.cwd().split('/');

    // search the current cwd backwards for a valid Squeezer project
    splitPath.reduce((curr) => {
      const currPath = splitPath.slice(0, curr).join('/');

      if (fs.existsSync(`${currPath}/squeezer.yml`)) {
        this.vars.project.identifier = _.upperFirst(
          _.camelCase(this.yaml.parse(`${currPath}/squeezer.yml`).name)
        );
        this.vars.project            = _.assign(
          {
            identifier : this.vars.project.identifier
          },
          this.yaml.parse(`${currPath}/squeezer.yml`)
        );

        if (this.vars.project.framework.name === 'squeezer') {
          this.vars.project.isValid = true;
          this.vars.project.path    = currPath;
        }
      }
      return curr - 1;
    }, splitPath.length);

    if (this.vars.project.isValid === true) {
      const buildPath             = `${this.vars.project.path}/.build`;
      this.vars.project.buildPath = buildPath;
      if (!fs.existsSync(buildPath)) {
        fs.mkdirSync(buildPath);
      }
    }
  }

  validateVersion() {
    const minNodeVersion  = 6;
    const baseNodeVersion = parseInt(process.version.split('.')[0].replace(/\D/g, ''), 0);

    if (baseNodeVersion < minNodeVersion) {
      this.cli.log.error(
        `Squeezer framework requires at least NodeJS version ${colors.blue.bold(minNodeVersion)}`
      );
    }

    if (this.cli.params.get().options.stage) {
      this.vars.stage = this.cli.params.get().options.stage;
    }
  }

  loadHooks() {
    /* load frameworks hooks */
    const frameworkPlugins = this.yaml.parse(`${__dirname}/../lib/plugins/plugins.yml`);

    _.forOwn(frameworkPlugins.plugins, (plugin) => {
      const hookFile = `${__dirname}/../lib/plugins/${plugin}/hooks.yml`;
      if (fs.existsSync(hookFile)) {
        const data = this.yaml.parse(hookFile).map((val) => {
          val.path = `${__dirname}/../lib/plugins/${plugin}/${val.path}`;
          return val;
        });

        this.vars.hooks = this.vars.hooks.concat(data);
      }
    });

    /* load plugins hooks */
    if (this.vars.project.isValid === true) {
      _.forEach(this.vars.project.plugins, (plugin) => {
        const hookFile = `${this.vars.project.path}/${plugin.path}/${plugin.name}/hooks.yml`;
        if (fs.existsSync(hookFile)) {
          const data = this
            .yaml.parse(hookFile)
            .map((val) => {
              val.path = `${this.vars.project.path}/${plugin.path}/${plugin.name}/${val.path}`;
              return val;
            });

          this.vars.hooks = this.vars.hooks.concat(data);
        }
      });
    }
  }
}

module.exports = new Squeezer();
