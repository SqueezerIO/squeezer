'use strict';

class InstallCmd {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['update'],
        summary     : 'Update project\'s & microservices packages',
        lifecycle   : [
          'project:validate',
          'microservices:load',
          'project:update'
        ],
        description : null,
        options     : {},
        examples    : [
          '--name my-first-project --template aws-generic'
        ]
      }
    ];
  }
}

module.exports = InstallCmd;
