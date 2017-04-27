'use strict';

const colors  = require('colors');
const fs      = require('fs');
const yaml    = require('js-yaml');
const _       = require('lodash');
const copydir = require('copy-dir');
const appRoot = require('app-root-path');
const path    = require('path');
const walkSync       = require('walk-sync');

/**
 * Class representing project orchestration .
 */
class Project {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Creates a project
   *
   * @param {string} name - project name
   * @param {string} cloud - cloud name
   * @param {string} language - language platform
   */
  create() {
    return new Promise((resolve) => {

      this.clouds = this.sqz.clouds.info.get();

      const paramsOptions = this.sqz.cli.params.get().options;
      const name          = paramsOptions.name[0];
      const cloud         = paramsOptions.cloud[0];
      const language      = paramsOptions.lang[0];

      this.projectPath = `${process.cwd()}/${name}`;

      this.sqz.cli.log.info(`Creating project ${colors.blue.bold(name)}`);
      this.sqz.cli.loader.start();

      this.sqz.cli.log.debug(`Validating project name ${colors.white(name)}`);
      if ( !name.match(/^[0-9a-z-]+$/i) ) {
        this.sqz.cli.log.error('Project name should contain only letters , numbers or "-" sign');
      }
      this.sqz.cli.log.debug(`Checking if cloud ${colors.white(cloud)} is supported`);
      if ( !_.has(this.clouds, cloud) ) {
        this.sqz.cli.log.error(`Cloud ${colors.blue.bold(cloud)} it's not currently supported by Squeezer framework`);
      }
      this.sqz.cli.log.debug(`Checking if language ${colors.white(language)} is supported`);
      if ( !_.has(this.clouds[cloud].languages, language) ) {
        this.sqz.cli.log.error(`Language ${colors.blue.bold(language)} it's not currently supported by ${colors.blue.bold(clouds[cloud].title)}`);
      }

      this.sqz.cli.log.debug(`Checking if project ${colors.blue.bold(name)} exists`);
      if ( fs.existsSync(this.projectPath) ) {
        this.sqz.cli.log.error(`A project with name ${colors.blue.bold(name)} already exists`);
      } else {
        fs.mkdirSync(this.projectPath);
      }

      this.sqz.cli.log.debug('Adding project skeleton');
      copydir.sync(`${appRoot}/lib/templates/projects/${language}`, `${this.projectPath}`);

      this.sqz.cli.log.debug('Adding microservices samples');
      copydir.sync(`${appRoot}/lib/templates/microservices/${cloud}/${language}`, `${this.projectPath}/microservices`);

      this.postCreate(name, cloud, language);

      this.sqz.cli.log.info(`Project successfully created !`);
      this.sqz.cli.log.info(`Please change to the project's directory by : ${colors.blue.bold(`$ cd ${name}`)}\n`);

      resolve();
    });
  }

  /**
   * Actions after creating the project
   *
   * @param {string} name - project name
   * @param {string} cloud - cloud name
   * @param {string} language - language platform
   */
  postCreate(name, cloud, language) {
    this.sqz.cli.log.debug('Post project creation actions');
    this.sqz.cli.log.debug('Compiling project config');
    let compiledProjectConfig = _.template(fs.readFileSync(`${appRoot}/lib/templates/squeezer.yml`, 'utf8'));

    fs.writeFileSync(`${this.projectPath}/squeezer.yml`, compiledProjectConfig({
      project : name,
      cloud   : cloud,
      runtime : language,
      version : this.sqz.clouds.info.get()[cloud].languages[language].default
    }));

    this.sqz.cli.loader.stop();
  }
}

module.exports = Project;
