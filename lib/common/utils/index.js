'use strict';

const _ = require('lodash');
const request = require('request');
// const fs = require('fs');
// const path = require('path');

/**
 * Class that manages some Squeezer utilities
 */
class Utilities {
  constructor(sqz) {
    this.sqz = sqz;
  }

  getIdentifier(value) {
    return _.upperFirst(_.camelCase(value));
  }

  getDeploymentKey() {
    return new Promise((resolve, reject) => {
      const projectPath = this.sqz.vars.project.path;
      const projectName = this.sqz.vars.project.name;
      const apiBaseUrl = this.sqz.vars.apiBaseUrl;
      const postProjectEndpoint = `${apiBaseUrl}/rest/v1/projects`;
      const squeezerConfig = this.sqz.yaml.parse(`${projectPath}/squeezer.yml`);

      this.sqz.cli.log.debug(
        `Retrieve a deployment key for project ${projectName}`
      );

      request.post(
        postProjectEndpoint,
        {
          json: {
            name: projectName,
            type: squeezerConfig.type
          }
        },
        (error, res, body) => {
          if (!error && res.statusCode === 200 && body.message === 'success') {
            resolve(body.data.key);
          } else if (body && body.message) {
            reject(body.message);
          } else if (error) {
            reject(error);
          } else {
            reject('Cannot retrieve a deployment key');
          }
        }
      );
    });
  }
}

module.exports = Utilities;
