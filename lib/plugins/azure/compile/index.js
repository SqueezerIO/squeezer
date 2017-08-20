'use strict';

const _                   = require('lodash');
const Arm      = require('../deploy/arm');
const fs                  = require('fs');
const fsExtra             = require('fs-extra');
const colors              = require('colors');
const Promise             = require('bluebird');
const MicroserviceARM = require('./lib/arm/microservice');
const Base                = require('./lib/arm/main/base');
// const IamRole             = require('./lib/cloudformation/main/iamRole');
// const IamPolicy           = require('./lib/cloudformation/main/iamPolicy');

/**
 * Class representing compilation orchestration for AWS resources
 */
class CompileAWS {
  constructor(sqz) {
    this.sqz                     = sqz;
    this.armBuildPath = `${this.sqz.vars.project.path}/.build/deploy/arm`;
  }

  run() {
    return new Promise((resolve) => {
      const armDeploy = new Arm(this.sqz);

      armDeploy.init().then(() => {
        this.compileArm().then(() => {
          resolve();
        });
      });
    });
  }

  /**
   * Compile all stacks
   */
  compileArm() {
    return new Promise((resolve) => {
      const self          = this;
      const base          = new Base(this.sqz);
      const microservices = this.sqz.variables.getMicroservices();

      /* clean project's .build directory */
      if (!fs.existsSync(this.armBuildPath)) {
        fsExtra.emptyDirSync(this.armBuildPath);
      }

      /* compile main ARM template stub */
      this.sqz.vars.azure.arm.main = base.compile();

      this.sqz.vars.azure.arm.main = base.addDeploymentStorageAccount();

      /* merging with the custom cloudformation templates */
      // const mainCustomTemplateData = this.sqz.yaml.parse(
      //   `${this.sqz.vars.project.path}/cloudformation/main-template.yml`
      // );
      //
      // if (mainCustomTemplateData) {
      //   _.forEach(mainCustomTemplateData.Resources, (val, key) => {
      //     const data = this.sqz.yaml.parse(
      //       `${this.sqz.vars.project.path}/cloudformation/${val.Properties.TemplateURL}`
      //     );
      //
      //     this.sqz.vars.aws.cloudFormation[key] = data;
      //   });
      //
      //   _.merge(this.sqz.vars.aws.cloudFormation.mainStack.Outputs, mainCustomTemplateData.Outputs);
      // }
      //
      // this.addMainStackResources();

      this.sqz.cli.log.info('Compiling microservices ARM templates');

      Promise.each(Object.keys(microservices), (key) => {
        return self.compileMicroservice(microservices[key]);
      }).then(() => {
        self.sqz.cli.log.info('Microservices ARM templates successfully compiled !');

        this.writeCfTemplates();

        console.log(JSON.stringify(this.sqz.vars.azure.arm.main, null , 2));
        process.exit(0);
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
      const microserviceARM = new MicroserviceARM(this.sqz, microservice);

      this.sqz.cli.log.info(`Compiling ARM template for microservice ${colors.blue.bold(microservice.name)}`);

      microserviceARM.compile().then(() => {
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
