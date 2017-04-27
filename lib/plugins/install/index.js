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
        options     : {},
        examples    : [
          ''
        ]
      }
    ];
  }
}

module.exports = InstallCmd;
