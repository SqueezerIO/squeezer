'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

class compilePackages {
  constructor(sqz, compileType) {
    this.sqz = sqz;
    this.compileType = compileType;
  }

  add(options) {
    const projectPath = this.sqz.vars.project.path;
    const packages = this.sqz.vars.functions[options.func.name].dependencies.packages;
    let commands = [];
    const packagesCmdsYaml = path.join(projectPath, 'lib', 'hooks', 'commands', 'compile', this.compileType, 'packages.yml');

    if (this.compileType === 'cloud' && fs.existsSync(packagesCmdsYaml) && _.keys(packages).length > 0) {
      // adding nodejs packages
      if (fs.existsSync(path.join(options.func.path, 'src', 'handler.js'))) {
        const packagesJson = {
          dependencies : {}
        };
        _.forEach(packages, (val, key) => {
          packagesJson.dependencies[key] = val;
        });
        fs.writeFileSync(path.join(options.output, 'package.json'), JSON.stringify(packagesJson, null, 2, 'utf8'));
        commands = this.sqz.yaml.parse(packagesCmdsYaml, options);
      }
    }

    return commands;
  }
}

module.exports = compilePackages;
