'use strict';

class InstallCmd {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['install'],
        summary     : 'Install project\'s & microservices packages',
        lifecycle   : [
          'project:validate',
          'microservices:load',
          'project:install'
        ],
        description : null,
        options     : {
          microservice : {
            title        : 'microservice name',
            flag         : 'm',
            description  : 'install packages only for a specific microservice',
            value        : true,
            required     : false,
            defaultValue : null
          }
        },
        examples    : [
          ''
        ]
      }
    ];
  }
}

module.exports = InstallCmd;
