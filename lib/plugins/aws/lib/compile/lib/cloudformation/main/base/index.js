'use strict';

/**
 * Class that manages the CloudFormation boilerplate
 */
class AWSStackBase {
  constructor(sqz, microservice) {
    this.sqz = sqz;

    this.microservice = microservice;
  }

  compile(description) {
    this.stub = {
      AWSTemplateFormatVersion : '2010-09-09',
      Description              : description,
      Parameters               : {},
      Resources                : {},
      Outputs                  : {}
    };

    return this.stub;
  }

  addS3DeploymentBucket() {
    this.stub.Resources.SqueezerDeploymentBucket = {
      Type : 'AWS::S3::Bucket'
    };

    this.stub.Outputs.SqueezerDeploymentBucket = {
      Value : {
        Ref : 'SqueezerDeploymentBucket'
      }
    };

    return this.stub;
  }
}

module.exports = AWSStackBase;
