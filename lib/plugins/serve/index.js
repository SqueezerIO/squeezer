'use strict';

class ServeCMD {
  constructor(sqz) {
    this.sqz        = sqz;

    const project = this.sqz.variables.getProject();
    const cloud   = project.cloud || {};

    const lifecycle = [
      'project:validate',
      `${cloud.name}:credentials`,
      'microservices:load',
      'project:info',
      'serve:run'
    ];

    this.commands = [
      {
        arg         : ['serve'],
        summary     : 'Serve project in watch mode . Live reload is enabled by default.',
        description : '',
        lifecycle   : lifecycle,
        options     : {
          stage : {
            title        : 'environment stage',
            description  : null,
            value        : true,
            required     : false,
            defaultValue : 'dev'
          }
        },
        examples    : [
          ''
        ]
      }
    ];
  }
}

module.exports = ServeCMD;
