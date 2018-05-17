'use strict';

class KeyCmd {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['genkey'],
        summary     : 'Will generate an access key',
        description : null,
        lifecycle   : [
          'key:get'
        ]
      }
    ];
  }
}

module.exports = KeyCmd;
