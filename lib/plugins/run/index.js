'use strict';

class RunCMD {
  constructor(sqz) {
    this.sqz = sqz;

    const project = this.sqz.variables.getProject();
    const cloud   = project.cloud || {};

    const lifecycle = [
      'project:validate',
      `${cloud.name}:credentials`,
      'microservices:load',
      // 'microservices:compile:run',
      'run:run'
    ];

    this.commands = [
      {
        arg         : ['run'],
        summary     : 'Run a function locally',
        description : '',
        lifecycle   : lifecycle,
        options     : {
          function : {
            title        : 'function name',
            flag         : 'f',
            description  : 'Function name stored in the sqz.config.yml file',
            value        : true,
            required     : true,
            defaultValue : null
          },
          path     : {
            title        : 'JSON event input file',
            flag         : 'p',
            description  : '',
            value        : true,
            required     : false,
            defaultValue : null
          },
          json     : {
            title        : 'JSON event input string',
            flag         : 'j',
            description  : '',
            value        : true,
            required     : false,
            defaultValue : null
          }
        },
        examples    : [
          '',
          '-f MyFunction',
          '-f MyFunction -p ./microservice/input.event.json',
          '-f MyFunction -j \'{"a":"b"}\''
        ]
      }
    ];
  }
}

module.exports = RunCMD;
