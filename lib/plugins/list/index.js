'use strict';

class ListCmd {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['list'],
        summary     : 'Lists all the available commands',
        description : null,
        lifecycle   : [
          'list:all'
        ]
      }
    ];
  }
}

module.exports = ListCmd;
