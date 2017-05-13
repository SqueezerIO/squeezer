'use strict';

class HelpCmd {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['help'],
        summary     : 'Displays help for a specific command',
        description : null,
        lifecycle   : [
          'help:run'
        ]
      }
    ];
  }
}

module.exports = HelpCmd;
