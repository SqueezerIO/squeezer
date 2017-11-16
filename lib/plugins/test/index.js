'use strict';

class TestCmd {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['test'],
        summary     : 'Run tests on your project',
        description : '',
        lifecycle   : [
          'project:validate',
          'functions:load',
          'test:run'
        ],
        options     : {
          function : {
            title        : 'function name',
            flag         : 'f',
            description  : 'run tests for a specific function',
            value        : true,
            required     : false,
            defaultValue : null
          },
          smart : {
            title        : 'run smart tests',
            flag         : 's',
            description  : 'Will trigger tests only for functions where code changed from the previous deployment',
            value        : false,
            required     : false,
            defaultValue : null
          }
        },
        examples    : [
          '',
          '--function hello',
          '-f hello',
          '--smart',
          '-s'
        ]
      }
    ];
  }
}

module.exports = TestCmd;
