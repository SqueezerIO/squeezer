'use strict';

const appRoot = require('app-root-path');
const _       = require('lodash');
const colors  = require('colors');
const fs      = require('fs');

const CommonArchiver   = require(`${appRoot}/lib/common/archiver`);
const CommonYaml       = require(`${appRoot}/lib/common/yaml`);
const CommonCommand    = require(`${appRoot}/lib/common/command`);
const CommonCliError   = require(`${appRoot}/lib/common/cli/error`);
const CommonCliLoader  = require(`${appRoot}/lib/common/cli/loader`);
const CommonCliLog     = require(`${appRoot}/lib/common/cli/log`);
const CommonCliParams  = require(`${appRoot}/lib/common/cli/params`);
const CommonCliHelp    = require(`${appRoot}/lib/common/cli/help`);
const CommonUtils      = require(`${appRoot}/lib/common/utils`);
const CommonCloudsInfo = require(`${appRoot}/lib/common/clouds/info`);
const CommonLifecycle  = require(`${appRoot}/lib/common/lifecycle`);
const CommonVariables  = require(`${appRoot}/lib/common/variables`);
const CommonVersion    = require(`${appRoot}/lib/common/version`);
const CommonConfig     = require(`${appRoot}/lib/common/config`);
const CommonValidate   = require(`${appRoot}/lib/common/validate`);
const CommonChecksums  = require(`${appRoot}/lib/common/checksums`);

class Squeezer {
  init() {
    this.cli        = {};
    this.cli.params = new CommonCliParams(this);
    this.cli.error  = new CommonCliError(this);
    this.cli.loader = new CommonCliLoader(this);
    this.cli.log    = new CommonCliLog(this);
    this.cli.help   = new CommonCliHelp(this);
    this.utils      = new CommonUtils(this);
    this.yaml       = new CommonYaml(this);
    this.lifecycle  = new CommonLifecycle(this);
    this.command    = new CommonCommand(this);
    this.variables  = new CommonVariables(this);
    this.archive    = new CommonArchiver(this);
    this.version    = new CommonVersion(this);
    this.config     = new CommonConfig(this);
    this.validate   = new CommonValidate(this);
    this.checksums  = new CommonChecksums(this);

    this.deploy = {};

    this.clouds      = {};
    this.clouds.info = new CommonCloudsInfo(this);

    this.vars               = {};
    this.vars.project       = {};
    this.vars.microservices = {};
    this.vars.hooks         = [];
    this.vars.apiBaseUrl    = 'https://api.squeezer.io';
    this.vars.stage         = 'dev';
    this.vars.assets        = {
      main          : {
        previousChecksum : null,
        currentChecksum  : null
      },
      microservices : [],
      uploadPaths   : []
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
      const buildPath = `${this.vars.project.path}/.build`;
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
    const frameworkPlugins = this.yaml.parse(`${appRoot}/lib/plugins/plugins.yml`);

    _.forOwn(frameworkPlugins.plugins, (plugin) => {
      const hookFile = `${appRoot}/lib/plugins/${plugin}/hooks.yml`;
      if (fs.existsSync(hookFile)) {
        const data = this.yaml.parse(hookFile).map((val) => {
          val.path = `${appRoot}/lib/plugins/${plugin}/${val.path}`;
          return val;
        });

        this.vars.hooks = this.vars.hooks.concat(data);
      }
    });


    /* load plugins hooks */
    if (this.vars.project.isValid === true) {
      _.forEach(this.vars.project.plugins, (plugin) => {
        const data = this
          .yaml.parse(`${this.vars.project.path}/${plugin.path}/${plugin.name}/hooks.yml`)
          .map((val) => {
            val.path = `${this.vars.project.path}/${plugin.path}/${plugin.name}/${val.path}`;
            return val;
          });

        this.vars.hooks = this.vars.hooks.concat(data);
      });
    }
  }
}

module.exports = new Squeezer();
