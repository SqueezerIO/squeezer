'use strict';

class LogsPluginIndex {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['logs'],
        summary     : 'Output the logs of a deployed function',
        description : '',
        lifecycle   : [
          'project:validate',
          'functions:load',
          'cloud:init',
          'cloud:logs'
        ],
        options     : {
          function : {
            title        : 'function name',
            flag         : 'f',
            description  : 'Name stored in the sqz.config.yml file',
            value        : true,
            required     : true,
            defaultValue : null
          }
        },
        examples    : [
          '',
          '--function MyFunction'
        ]
      }
    ];
  }
}

module.exports = LogsPluginIndex;
