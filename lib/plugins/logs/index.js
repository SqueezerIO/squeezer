'use strict';

class LogsCMD {
  constructor(sqz) {
    this.sqz = sqz;

    const project = this.sqz.variables.getProject();
    const cloud = project.cloud || {};

    const lifecycle = [
      'project:validate',
      `${cloud.name}:credentials`,
      'logs:run'
    ];

    this.commands = [
      {
        arg         : ['logs'],
        summary     : 'Output the logs of a deployed function',
        description : '',
        lifecycle   : lifecycle,
        options     : {
          function : {
            title        : 'function name',
            flag         : 'f',
            description  : 'Name stored in the sqz.config.yml file',
            value        : true,
            required     : true,
            defaultValue : null
          },
          stage    : {
            title        : 'environment stage',
            flag         : 's',
            description  : null,
            value        : true,
            required     : false,
            defaultValue : 'dev'
          },
          region   : {
            title        : 'cloud region',
            flag         : 'r',
            description  : null,
            value        : true,
            required     : false,
            defaultValue : 'us-east-1'
          }
        },
        examples    : [
          '',
          '--function MyFunction'
        ]
      }
    ];
  }
}

module.exports = LogsCMD;
