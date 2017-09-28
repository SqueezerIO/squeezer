'use strict';

class PluginRun {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['run'],
        summary     : 'Run a function locally',
        description : '',
        lifecycle   : [
          'project:validate',
          'cloud:init',
          'functions:load',
          'function:run'
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
          }
        },
        examples    : [
          '',
          '-f MyFunction',
          '-f MyFunction -p input.event.json',
          '-f MyFunction -j \'{"a":"b"}\''
        ]
      }
    ];
  }
}

module.exports = PluginRun;
