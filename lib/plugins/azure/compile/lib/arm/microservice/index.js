'use strict';

const TemplateCompile = require('./lib/compile');
const fs              = require('fs');

/**
 * Class that manages Cloud Stack create & update microservices templates
 */
class microserviceARM {
  constructor(sqz, microservice) {
    this.sqz = sqz;
    this.microservice         = microservice;
  }

  compile() {
    return new Promise((resolve) => {
      this.compileARMTemplate();

      resolve();
    });
  }

  compileARMTemplate() {
    const templateCompile = new TemplateCompile(this.sqz, this.microservice);

    templateCompile.functions();

    this.sqz.vars.microservices[this.microservice.name].aws.stackCompiledTemplate =
      templateCompile.get();

    const prettyTemplate = JSON.stringify(templateCompile.get(), null, 2);

    fs.writeFileSync(
      `${this.sqz.vars.project.path}/.build/deploy/arm/` +
      `${this.microservice.identifier}arm-template.json`, prettyTemplate
    );
  }
}

module.exports = microserviceARM;
