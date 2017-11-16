'use strict';

class InvokePluginIndex {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['invoke'],
        summary     : 'Invoke a function directly in the cloud environment',
        description : '',
        lifecycle   : [
          'project:validate',
          'functions:load',
          'invoke:run'
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
