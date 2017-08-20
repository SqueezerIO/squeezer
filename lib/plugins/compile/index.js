'use strict';

const colors = require('colors');

class CompilePlugin {
  constructor(sqz) {
    this.sqz = sqz;

    const lifecycle = [
      'project:validate',
      'microservices:load',
      'project:info',
      'compile:run'
    ];

    this.commands = [
      {
        arg         : ['compile'],
        summary     : 'Compile all the microservices',
        description : 'Compile all the microservices available , this is required before running functions locally or making cloud deployments ',
        lifecycle   : lifecycle,
        options     : {
          microservice : {
            title        : 'microservice name',
            flag    : 'm',
            description  : 'Compiles only a specific microservice',
            value        : true,
            required     : false,
            defaultValue : null
          },
          cloud        : {
            title        : `enable cloud compiling, default is ${colors.blue.bold('development')}`,
            flag         : 'p',
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
