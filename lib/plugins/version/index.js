'use strict';

class Version {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['version'],
        summary     : 'Shows information of your currently globally installed Squeezer CLI',
        description : null,
        lifecycle   : [
          'version:display'
        ]
      }
    ];
  }
}

module.exports = Version;
