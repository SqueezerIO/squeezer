'use strict';

const Promise = require('bluebird');
const fs      = require('fs');
const path    = require('path');
const AWS     = require('aws-sdk');
const _       = require('lodash');

const s3 = new AWS.S3();

const mimeExts = require('./ext-list.json');

const s3Stream = require('s3-upload-stream')(s3);


/**
 * Upload web app assets
 */
class AWSAssets {
  constructor(sqz) {
    this.sqz = sqz;
  }

  upload() {
    return new Promise((resolve) => {
      if (this.sqz.vars.project.type === 'web') {
        this.sqz.cli.log.info('Uploading web assets to the S3 web bucket.');
        this.sqz.cli.loader.start();

        Promise.each(_.keys(this.sqz.vars.currentChecksums.assets), (src) => {
          const currentChecksum  = this.sqz.vars.currentChecksums.assets[src];
          const previousChecksum = this.sqz.vars.previousChecksums.assets[src];
          return this.processAsset(src, currentChecksum, previousChecksum);
        }).then(() => {
          this.sqz.cli.loader.stop();
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  processAsset(src, currentChecksum, previousChecksum) {
    return new Promise((resolve) => {
      this.uploadAsset(src, currentChecksum, previousChecksum).then(() => {
        this.removePreviousAsset(src, currentChecksum, previousChecksum).then(() => {
          resolve();
        });
      });
    });
  }

  uploadAsset(src, currentChecksum, previousChecksum) {
    return new Promise((resolve, reject) => {
      if (currentChecksum !== previousChecksum) {
        const read      = fs.createReadStream(`${this.sqz.vars.project.buildPath}/production/assets/${src}`);
        const parsedSrc = path.parse(src);
        const s3Key     = `assets/${parsedSrc.dir}/${parsedSrc.name}-${currentChecksum}${parsedSrc.ext}`;
        const ext       = parsedSrc.ext.split('.')[1];
        const mime      = mimeExts[ext];
        const upload    = s3Stream.upload({
          Bucket      : this.sqz.vars.aws.cfOutputs.WebBucket,
          Key         : s3Key,
          ACL         : 'public-read',
          ContentType : mime
        });

        this.sqz.cli.log.debug(`Uploading ${src} as ${s3Key}`);

        upload.on('error', (error) => {
          reject(error);
        });

        upload.on('uploaded', () => {
          resolve();
        });

        read.pipe(upload);
      } else {
        resolve();
      }
    });
  }

  removePreviousAsset(src, currentChecksum, previousChecksum) {
    return new Promise((resolve, reject) => {
      if (currentChecksum !== previousChecksum && !_.isEmpty(previousChecksum)) {
        const parsedSrc = path.parse(src);
        const s3Key     = `assets/${parsedSrc.dir}/${parsedSrc.name}-${previousChecksum}${parsedSrc.ext}`;
        const params = {
          Bucket      : this.sqz.vars.aws.cfOutputs.WebBucket,
          Key         : s3Key
        };

        this.sqz.cli.log.debug(`Removing s3 resource ${s3Key}`);

        s3.deleteObject(params, (err) => {
          if (err) reject(err);
          else     resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = AWSAssets;
