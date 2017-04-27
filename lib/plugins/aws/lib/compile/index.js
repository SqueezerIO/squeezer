'use strict';

const _                   = require('lodash');
const CloudFormation      = require('../deploy/cloudformation');
const fs                  = require('fs');
const fsExtra             = require('fs-extra');
const colors              = require('colors');
const Promise             = require('bluebird');
const CloudformationStack = require('./lib/cloudformation/microservice');
const Base                = require('./lib/cloudformation/main/base');
const IamRole             = require('./lib/cloudformation/main/iamRole');
const IamPolicy           = require('./lib/cloudformation/main/iamPolicy');

/**
 * Class representing compilation orchestration for AWS resources
 */
class CompileAWS {
  constructor(sqz) {
    this.sqz                     = sqz;
    this.cloudFormationBuildPath = `${this.sqz.vars.project.path}/.build/deploy/cloudformation`;
  }

  run() {
    return new Promise((resolve) => {
      const cloudFormationDeploy = new CloudFormation(this.sqz);

      cloudFormationDeploy.create().then(() => {
        this.compileStacks().then(() => {
          resolve();
        });
      });
    });
  }

  /**
   * Compile all stacks
   */
  compileStacks() {
    return new Promise((resolve) => {
      const self          = this;
      const base          = new Base();
      const microservices = this.sqz.variables.getMicroservices();

      /* clean project's .build directory */
      if (!fs.existsSync(this.cloudFormationBuildPath)) {
        fsExtra.ensureDirSync(this.cloudFormationBuildPath);
      }

      /* compile main stack stub */
      this.sqz.vars.aws.cloudFormation.mainStack = base.compile(
        'main stack'
      );

      this.sqz.vars.aws.cloudFormation.mainStack = base.addS3DeploymentBucket();

      /* compile IAM stack */
      this.sqz.vars.aws.cloudFormation.iamStack = this.compileIam();

      /* merging with the custom cloudformation templates */
      const mainCustomTemplateData = this.sqz.yaml.parse(
        `${this.sqz.vars.project.path}/cloudformation/main-template.yml`
      );

      if (mainCustomTemplateData) {
        _.forEach(mainCustomTemplateData.Resources, (val, key) => {
          const data = this.sqz.yaml.parse(
            `${this.sqz.vars.project.path}/cloudformation/${val.Properties.TemplateURL}`
          );

          this.sqz.vars.aws.cloudFormation[key] = data;
        });

        _.merge(this.sqz.vars.aws.cloudFormation.mainStack.Outputs, mainCustomTemplateData.Outputs);
      }

      this.addMainStackResources();

      this.sqz.cli.log.info('Compiling available microservices CF templates');

      Promise.each(Object.keys(microservices), (key) => {
        return self.compileMicroservice(microservices[key]);
      }).then(() => {
        self.sqz.cli.log.info('Microservices CF templates successfully compiled !');

        this.writeCfTemplates();

        // process.exit(0);
        resolve();
      });
    });
  }

  /**
   * Compile a single microservice
   *
   * @param {string} name - microservice name
   */
  compileMicroservice(microservice) {
    return new Promise((resolve) => {
      const cloudformationStack = new CloudformationStack(this.sqz, microservice);

      this.sqz.cli.log.info(`Compiling CF template for microservice ${colors.blue.bold(microservice.name)}`);

      cloudformationStack.compile().then(() => {
        resolve();
      });
    });
  }

  /**
   * Add main stack nested stacks resources
   */
  addMainStackResources() {
    const cloudFormation = this.sqz.vars.aws.cloudFormation;

    _.forEach(cloudFormation, (val, key) => {
      if (key !== 'mainStack') {
        if (!_.has(cloudFormation.mainStack.Resources, key)) {
          cloudFormation.mainStack.Resources[key] = {
            Type       : 'AWS::CloudFormation::Stack',
            Properties : {
              TemplateURL      : `https://s3.amazonaws.com/${this.sqz.vars.aws.cfOutputs.SqueezerDeploymentBucket}` +
              `/${this.sqz.vars.stage}/cloudformation/${key}-template.json`,
              TimeoutInMinutes : 10
            }
          };
        }
      }
    });
  }

  /**
   * write current cloudformation stack templates
   */
  writeCfTemplates() {
    const cloudFormation = this.sqz.vars.aws.cloudFormation;

    _.forEach(cloudFormation, (val, key) => {
      const filename = `${key}-template.json`;

      if (key !== 'mainStack') {
        this.addTemplate(filename, val);
      }
    });

    this.addTemplate('mainStack-template.json', cloudFormation.mainStack);
  }

  /**
   * add a CF template
   *
   * @param {string} path - path
   * @param {string} filename - filename
   * @param {string} data - template body
   */
  addTemplate(filename, data) {
    const path = this.cloudFormationBuildPath;

    fs.writeFileSync(
      `${path}/${filename}`,
      JSON.stringify(data, null, 2)
    );

    this.sqz.vars.aws.s3Uploads.push({
      path  : path,
      name  : filename,
      s3Key : `${this.sqz.vars.stage}/cloudformation/${filename}`
    });
  }

  /**
   * compile IAM roles and policies
   */
  compileIam() {
    const base   = new Base();
    let template = base.compile('IAM roles and policies stack');

    const iamRole   = new IamRole(this.sqz, template);
    template        = iamRole.compile();
    const iamPolicy = new IamPolicy(this.sqz, template);
    template        = iamPolicy.compile();

    return template;
  }
}

module.exports = CompileAWS;
