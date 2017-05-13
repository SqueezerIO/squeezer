'use strict';

const _                 = require('lodash');
const fs                = require('fs');
const colors            = require('colors');
const express           = require('express');
const bodyParser        = require('body-parser');
const appRoot           = require('app-root-path');
const Swagger           = require('../swagger');
const Aws               = require('../aws');
const UrlPattern        = require('url-pattern');
const Watcher           = require('./watcher');
const Livereload        = require('./livereload');
const LoadMicroservices = require('../../../microservices/lib/load');

/**
 * Class that serves a Squeezer project
 */
class Express {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Start the Node Express server
   */
  run() {
    return new Promise((resolve) => {
      const app         = express();
      const projectType = this.sqz.vars.project.type;
      const projectPath = this.sqz.vars.project.path;
      const project     = this.sqz.vars.project;
      const aws         = new Aws(this.sqz);
      const port        = 4001;
      const apiUrl      = `http://localhost:${port}`;

      app.use((req, res, next) => {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, '
          + 'max-stale=0, post-check=0, pre-check=0');
        req.rawBody = '';

        req.setEncoding('utf8');

        req.on('data', (chunk) => {
          req.rawBody += chunk;
        });

        req.on('end', () => {
          next();
        });
      });

      app.use(bodyParser.raw());

      if (projectType === 'web') {
        const livereload = new Livereload(this.sqz);
        livereload.init(app);
      }

      const watcher = new Watcher(this.sqz);
      watcher.init();

      if (projectType === 'api') {
        const swagger     = new Swagger(this.sqz);
        const swaggerData = swagger.run();

        app.use('/swagger-ui', express.static(`${appRoot}/lib/plugins/serve/public/swagger`));

        app.get('/api-docs.json', (req, res) => {
          res.send(swagger.run());
        });

        if (!_.isEmpty(swaggerData.paths)) {
          this.sqz.cli.log.info(`Swagger API Docs   ${colors.blue.bold(`${apiUrl}/swagger-ui`)}`);
        }
      }

      app.use('/.build', express.static(`${project.buildPath}`, { fallthrough : false, maxAge : 0 }));

      app.all('*', (req, res) => {
        const data = this.find(req.url, req.method);

        const target = `${projectPath}/.build/development/microservices/${data.microservice.identifier}`;

        if (!fs.existsSync(target)) {
          this.sqz.cli.log.error(`Microservice ${colors.blue.bold(data.microservice.name)} is not compiled !`);
        }

        if (!data) {
          res.status(400).send({
            error : 'Invalid URL path : There is no any event function configured with this url path'
          });
        } else if (this.sqz.vars.project.cloud.name === 'aws') {
          aws.run(req, res, data);
        }
      });

      app.listen(port, () => {
        this.sqz.cli.log.info(`Listening on       ${colors.blue.bold(apiUrl)}`);
        resolve();
      });
    });
  }

  /**
   * Find a function's HTTP event that matches to the current requested URL
   *
   * @param url - http request url
   * @param method - http method
   */
  find(url, method) {
    const loadMicroservices = new LoadMicroservices(this.sqz);
    loadMicroservices.load();
    //
    // const microservicesPaths = walkSync('microservices', { globs : ['*/sqz.config.yml'] });
    let data = null;
    //
    // _.forEach(microservicesPaths, (microservicePath) => {
    _.forEach(this.sqz.vars.microservices, (microservice) => {
      // const microservice = this.sqz.yaml.parse(`microservices/${microservicePath}`);
      // microservice.identifier = _.upperFirst(_.camelCase(microservice.name));
      _.forEach(microservice.functions, (func, name) => {
        func.name = name;
        _.forEach(func.events, (val) => {
          const type  = Object.keys(val)[0];
          const event = val[type];

          if (type === 'http') {
            const expressPathFormatted = `${event.path.replace(/{(.*?)}/g, ':$1')}`;
            const pattern              = new UrlPattern(expressPathFormatted);
            const patternMatch         = pattern.match(url.split('?')[0]);
            if (patternMatch && event.method.toUpperCase() === method) {
              data = {
                microservice   : microservice,
                func           : func,
                event          : event,
                pathParameters : patternMatch
              };
            }
          }
        });
      });
    });

    return data;
  }
}

module.exports = Express;
