'use strict';

class RemovePluginIndex {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['remove'],
        summary     : 'Remove all deployed project\'s resources',
        description : '',
        lifecycle   : [
          'project:validate',
          'cloud:init',
          'functions:load',
          'project:info',
          'cloud:remove'
        ],
        options     : {},
        examples    : [
          ''
        ]
      }
    ];
  }
}

module.exports = RemovePluginIndex;
