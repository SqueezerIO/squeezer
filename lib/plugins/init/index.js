'use strict';

class InstallCmd {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['init'],
        summary     : 'Add a new deployment key to your project',
        lifecycle   : [
          'project:validate',
          'project:init'
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
