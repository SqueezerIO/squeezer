'use strict';

const _        = require('lodash');
const walkSync = require('walk-sync');
/**
 * Class manages Swagger JSON file building
 */
class Express {
  constructor(sqz) {
    this.sqz = sqz;
  }

  init() {
    this.swagger = {
      swagger     : '2.0',
      info        : {
        description    : 'Loads documentation from the <b>swagger.yml</b> ' +
        'files stored in the  microservices directories',
        version        : '1.0.0',
        title          : 'API documentation',
        termsOfService : 'http://swagger.io/terms/',
        contact        : {
          email : 'nick@squeezer.io'
        },
        license        : {
          name : 'Apache 2.0',
          url  : 'http://www.apache.org/licenses/LICENSE-2.0.html'
        }
      },
      basePath    : '/',
      tags        : [],
      schemes     : [
        'http'
      ],
      paths       : {},
      definitions : {}
    };
  }

  run() {
    this.init();
    this.load();

    return this.swagger;
  }

  load() {
    const swaggerFiles = walkSync(
      `${this.sqz.vars.project.path}`,
      {
        globs : ['microservices/*/sqz.swagger.yml']
      }
    );

    _.forEach(swaggerFiles, (file) => {
      const data = this.sqz.yaml.parse(`${this.sqz.vars.project.path}/${file}`);

      /* add paths to the Swagger main object */
      _.forEach(data.paths, (pathVal, pathName) => {
        if (!_.has(this.swagger.paths, pathName)) {
          this.swagger.paths[pathName] = {};
        }
        _.forEach(pathVal, (methodVal, methodName) => {
          this.swagger.paths[pathName][methodName] = methodVal;
        });
      });

      /* add definitions to the Swagger main object */
      _.forEach(data.definitions, (definitionVal, definitionName) => {
        this.swagger.definitions[definitionName] = definitionVal;
      });
    });
  }
}

module.exports = Express;
