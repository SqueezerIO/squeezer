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
        summary     : 'Deploys the current project into the cloud.',
        description : 'If no options are specified all your available ' +
        'microservices where code changed from the last deployment will be deployed.',
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
          '',
          '--stage dev --region us-east-1',
          '--force',
          '--microservice my-first-microservice',
        ]
      }
    ];
  }
}

module.exports = ServeCMD;
