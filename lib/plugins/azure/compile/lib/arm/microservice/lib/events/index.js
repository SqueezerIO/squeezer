'use strict';

const _                   = require('lodash');
const ApiGatewayMainStack = require('../../../../main/apiGateway');
const Outputs             = require('../../outputs');

/**
 * Class that manages the HTTP event
 */
class azureCompileHttpEvent {
  constructor(sqz, microservice, template) {
    this.sqz          = sqz;
    this.microservice = microservice;
    this.template     = template;
  }

  compile(event, azureFunction) {
    event.identifier      = `${_.upperFirst(event.method)}` +
      `${_.upperFirst(_.camelCase(event.path))}`;
    event.corsIdentifier  = 'Options' +
      `${_.upperFirst(_.camelCase(event.path))}`;
    event.shortIdentifier = `${_.upperFirst(_.camelCase(event.path))}`;

    return this.template;
  }
}

module.exports = azureCompileHttpEvent;
