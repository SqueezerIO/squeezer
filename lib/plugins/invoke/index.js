'use strict';

class InvokeCMD {
  constructor(sqz) {
    this.sqz = sqz;

    const project = this.sqz.variables.getProject();
    const cloud = project.cloud || {};

    const lifecycle = [
      'project:validate',
      `${cloud.name}:credentials`,
      'invoke:run'
    ];

    this.commands = [
      {
        arg         : ['invoke'],
        summary     : 'Invoke a function directly in the Cloud',
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
          stage    : {
            title        : 'environment stage',
            description  : null,
            value        : true,
            required     : false,
            defaultValue : 'dev'
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

module.exports = InvokeCMD;
