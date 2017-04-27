'use strict';

class Config {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['config'],
        summary     : 'Configure a setting which will be stored on ~/.sqzrc',
        description : null,
        lifecycle   : [
          'project:validate',
          'config:set'
        ],
        options     : {
          setting : {
            title        : 'setting name',
            flag         : 's',
            required     : true,
            defaultValue : null
          },
          value   : {
            title        : 'setting value',
            flag         : 'v',
            required     : true,
            defaultValue : null
          }
        },
        examples    : [
          '--setting aws-profile --value my-profile'
        ]
      }
    ];
  }
}

module.exports = Config;
