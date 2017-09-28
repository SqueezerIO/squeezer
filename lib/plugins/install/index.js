'use strict';

class InstallCmd {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['install'],
        summary     : 'Install project\'s packages',
        lifecycle   : [
          'project:validate',
          'functions:load',
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
