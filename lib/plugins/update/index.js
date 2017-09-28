'use strict';

class UpdateCmd {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['update'],
        summary     : 'Update project\'s packages',
        lifecycle   : [
          'project:validate',
          'project:update'
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

module.exports = UpdateCmd;
