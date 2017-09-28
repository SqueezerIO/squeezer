'use strict';

const _    = require('lodash');
const fs   = require('fs');
const exec = require('sync-exec');

/**
 * Plugin that copies only of the required modules when packaging the function
 */

function NodeModulesPlugin(options) {
  this.options = Object.assign({}, {
    path        : '.',
    prettyPrint : false,
    update      : false,
    fullPath    : true
  }, options);
}

NodeModulesPlugin.prototype = {
  constructor : NodeModulesPlugin,
  apply       : (compiler) => {
    this.externalModules = [];

    const self = this;

    compiler.plugin('emit', (compilation, callback) => {
      Object.keys(compilation.modules).forEach((key) => {
        const val    = compilation.modules[key];
        const module = val.request;

        if (val.portableId.indexOf('external ') > -1) {
          if (!_.includes(self.externalModules, module)) {
            self.externalModules.push(module);
          }
        }

        self.compilationOptions = compilation.options;
      });

      callback();
    });

    compiler.plugin('done', () => {
      const output  = self.compilationOptions.output.path;
      const context = self.compilationOptions.context;
      const pkg     = JSON.parse(fs.readFileSync(`${context}/package.json`, 'utf8'));
      const packages = _.merge(pkg.dependencies, pkg.devDependencies);

      const finalModules = [];

      _.forEach(self.externalModules, (module) => {
        let rootModule = module.split('/')[0];

        if (_.has(packages, rootModule)) {
          rootModule += `@${packages[rootModule]}`;
        }

        finalModules.push(rootModule);
      });
      const spacedPkgs = finalModules.join(' ');

      const cmd = `npm install ${spacedPkgs} --prefix ${output}`;

      console.log(cmd); // eslint-disable-line no-console

      const installPkgsExec = exec(cmd);

      if (installPkgsExec.stderr) {
        throw new Error(`Command error:\n\n${installPkgsExec.stderr}`);
      }
    });
  }
};

module.exports = NodeModulesPlugin;
