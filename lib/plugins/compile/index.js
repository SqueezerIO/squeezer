'use strict';

const colors = require('colors');

class Deploy {
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
          production        : {
            title        : `enable production compiling default is ${colors.blue.bold('development')}`,
            flag         : 'p',
            description  : '',
            value        : false,
            required     : false,
            defaultValue : null
          }
        },
        examples    : [
          '',
          '--stage dev --region us-east-1',
          '--force',
          '--microservice my-first-microservice'
        ]
      }
    ];
  }
}

module.exports = Deploy;
