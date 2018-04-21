'use strict';

const _ = require('lodash');
const path = require('path');

class Functions {
  constructor(sqz) {
    this.sqz = sqz;
  }

  add(functionPath, functionService) {
    const options = this.sqz.cli.params.get().options;
    const configFilePath = path.join(functionPath, 'squeezer.yml');
    const functionObject = this.sqz.yaml.parse(configFilePath);
    const functionName = functionObject.name;
    const functionIdentifier = this.sqz.utils.getIdentifier(functionName);
    const functionOpt = options.function || null;

    let flagged = true;
    let force = false;

    if (!functionName) {
      this.sqz.cli.log.error(`Missing function name on ${configFilePath}`);
    }

    if (functionOpt && functionName !== functionOpt) {
      flagged = false;
    }

    if (_.has(options, 'force')) {
      force = true;
    }

    _.assign(functionObject,
      this.constructFunctionObj(functionObject, functionName, functionIdentifier,
        functionService, functionPath, flagged, force));

    if (_.has(this.sqz.vars.functions, functionName)) {
      this.sqz.cli.log.error(`There is a duplicated function with name "${functionName}"`);
    }

    this.sqz.vars.functions[functionObject.name] = functionObject;
  }

  constructFunctionObj(functionObject, functionName, functionIdentifier,
    functionService, functionPath, flagged, force) {
    return {
      name: functionName,
      handler: 'handler',
      timeout: functionObject.timeout || 6,
      memory: functionObject.memory || 128,
      identifier: functionIdentifier,
      service: functionService,
      serviceIdentifier: this.sqz.utils.getIdentifier(functionService),
      path: functionPath,
      packagePath: path.join(this.sqz.vars.project.buildPath, 'deploy', 'functions'),
      packageFile: `${functionIdentifier}.zip`,
      flagged: flagged,
      force: force
    };
  }

  get() {
    return this.sqz.vars.functions;
  }
}

module.exports = Functions;
