'use strict';

class Deploy {
  constructor(sqz) {
    this.sqz = sqz;

    const project = this.sqz.variables.getProject();
    const cloud = project.cloud || {};

    const lifecycle = [
      'project:validate',
      'microservices:load',
      'project:info',
      `${cloud.name}:credentials`,
      'deploy:checksums:get',
      'deploy:compile',
      `${cloud.name}:compile`,
      `${cloud.name}:deploy`,
      `${cloud.name}:assets`,
      'deploy:checksums:save'
    ];

    this.commands = [
      {
        arg         : ['deploy'],
        summary     : 'Deploys the current project into the cloud.',
        description : 'If no options are specified all your available microservices ' +
        'where code changed from the last deployment will be deployed.',
        lifecycle   : lifecycle,
        options     : {
          microservice : {
            title        : 'microservice name',
            flag    : 'm',
            description  : 'Deploys only a specific microservice',
            value        : true,
            required     : false,
            defaultValue : null
          },
          force        : {
            title        : 'force deployement',
            flag         : 'f',
            description  : 'Force deployment for all the current microservices \n' +
            'NOTE : Will deploy all microservices , even the ones with no code changes ' +
            'from the last deployment.',
            value        : false,
            required     : false,
            defaultValue : null
          },
          stage        : {
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
          '--microservice my-first-microservice'
        ]
      }
    ];
  }
}

module.exports = Deploy;
