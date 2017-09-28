'use strict';

class CompilePlugin {
  constructor(sqz) {
    this.sqz = sqz;

    const lifecycle = [
      'project:validate',
      'functions:load',
      'project:info',
      'cloud:init',
      'compile:run'
    ];

    this.commands = [
      {
        arg         : ['compile'],
        summary     : 'Compile available functions',
        description : 'Compile all the available functions ( pre-requirement for both development & deployments )',
        lifecycle   : lifecycle,
        options     : {
          function : {
            title        : 'function name',
            flag         : 'f',
            description  : 'Compiles only a specific function',
            value        : true,
            required     : false,
            defaultValue : null
          },
          cloud        : {
            title        : 'enable cloud compiling, default is "development"',
            flag         : 'c',
            description  : '',
            value        : false,
            required     : false,
            defaultValue : null
          }
        },
        examples    : [
          '',
          '--cloud'
        ]
      }
    ];
  }
}

module.exports = CompilePlugin;
