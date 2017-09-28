'use strict';

class InvokePluginIndex {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['invoke'],
        summary     : 'Invoke a function directly in the Cloud',
        description : '',
        lifecycle   : [
          'project:validate',
          'functions:load',
          'cloud:init',
          'cloud:invoke'
        ],
        options     : {
          function : {
            title        : 'function name',
            flag         : 'f',
            description  : 'Function name stored in the sqz.config.yml file',
            value        : true,
            required     : true,
            defaultValue : null
          },
          path     : {
            title        : 'JSON event input file',
            flag         : 'p',
            description  : '',
            value        : true,
            required     : false,
            defaultValue : null
          },
          json     : {
            title        : 'JSON event input string',
            flag         : 'j',
            description  : '',
            value        : true,
            required     : false,
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
          '--function MyFunction',
          '-f MyFunction -p input.event.json',
          '-f MyFunction -j \'{"a":"b"}\''
        ]
      }
    ];
  }
}

module.exports = InvokePluginIndex;
