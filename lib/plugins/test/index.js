'use strict';

class TestCmd {
  constructor(sqz) {
    this.sqz = sqz;

    const project = this.sqz.variables.getProject();
    const cloud   = project.cloud || {};

    const lifecycle = [
      'project:validate',
      `${cloud.name}:credentials`,
      'microservices:load',
      'project:info',
      'serve:run',
      'test:run'
    ];

    this.commands = [
      {
        arg         : ['test'],
        summary     : 'Run available tests on your current project',
        description : '',
        lifecycle   : lifecycle,
        options     : {
          microservice : {
            title        : 'microservice name',
            flag         : 'm',
            description  : 'run tests for only a specific microservice',
            value        : true,
            required     : false,
            defaultValue : null
          },
          unit : {
            title        : 'run available unit tests',
            flag         : 'u',
            description  : '',
            value        : false,
            required     : false,
            defaultValue : null
          },
          integration : {
            title        : 'run available integration tests',
            flag         : 'i',
            description  : '',
            value        : false,
            required     : false,
            defaultValue : null
          }
        },
        examples    : [
          '',
          '--microservice my-first-microservice'
        ]
      }
    ];
  }
}

module.exports = TestCmd;
