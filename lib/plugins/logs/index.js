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
          'logs:run'
        ],
        options     : {
          function : {
            title        : 'function name',
            flag         : 'f',
            description  : '',
            value        : true,
            required     : true,
            defaultValue : null
          },
          stage    : {
            title        : 'environment stage',
            description  : null,
            value        : true,
            required     : false,
            defaultValue : 'dev'
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
