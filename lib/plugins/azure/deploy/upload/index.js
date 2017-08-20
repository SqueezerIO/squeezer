'use strict';

const Promise  = require('bluebird');
const AWS      = require('aws-sdk');
const fs       = require('fs');
const colors   = require('colors');

const s3       = new AWS.S3();

const s3Stream = require('s3-upload-stream')(s3);

/**
 * Class representing microservice's AWS S3 bucket upload
 */
class UploadAWS {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      Promise.each(this.sqz.vars.aws.s3Uploads, (file) => {
        return this.uploadFile(file.path, file.name, file.s3Key);
      }).then(() => {
        this.sqz.cli.log.debug('Assets successfully uploaded to the S3 bucket !');
        resolve();
      });
    });
  }

  uploadFile(path, filename, s3Key) {
    return new Promise((resolve, reject) => {
      this.sqz.cli.log.info(`Uploading ${colors.blue.bold(filename)} to the S3 bucket.`);
      this.sqz.cli.loader.start();

      const read   = fs.createReadStream(`${path}/${filename}`);
      const upload = s3Stream.upload({
        Bucket : this.sqz.vars.aws.cfOutputs.SqueezerDeploymentBucket,
        Key    : s3Key
      });

      upload.on('error', (error) => {
        reject(error);
      });

      upload.on('uploaded', () => {
        this.sqz.cli.loader.stop();

        resolve();
      });

      read.pipe(upload);
    });
  }

  /**
   * remove old S3 objects
   */
  cleanBucket(microservice) {
    return new Promise((resolve, reject) => {
      const params       = {
        Bucket : this.sqz.vars.aws.cfOutputs.SqueezerDeploymentBucket,
        Prefix : `${this.sqz.vars.stage}/${microservice.identifier}`
      };
      const maxS3Objects = 5;

      s3.listObjects(params, (err, data) => {
        const delParams  = { Bucket : this.sqz.vars.aws.cfOutputs.SqueezerDeploymentBucket };
        delParams.Delete = { Objects : [] };

        if (err) {
          reject(err);
        }

        if (data.Contents.length > maxS3Objects) {
          data.Contents.slice(0, -Math.abs(maxS3Objects)).forEach((obj) => {
            delParams.Delete.Objects.push({ Key : obj.Key });
          });
          s3.deleteObjects(delParams, (s3Err) => {
            if (err) {
              reject(s3Err);
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

}

module.exports = UploadAWS;
