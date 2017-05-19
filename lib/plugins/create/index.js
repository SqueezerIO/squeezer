'use strict';

const colors = require('colors');

class ProjectCreateCmd {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['create'],
        summary     : 'Create a Squeezer project',
        lifecycle   : [
          'project:create'
        ],
        description : null,
        options     : {
          project     : {
            title        : 'Project\'s name',
            flag         : 'p',
            required     : true,
            defaultValue : null
          },
          email       : {
            title        : 'Project\'s owner email address',
            flag         : 'e',
            required     : true,
            defaultValue : null
          },
          template    : {
            title        : `Project's template , get available templates : ${colors.blue.bold('sqz templates')}`,
            flag         : 't',
            required     : true,
            defaultValue : null
          },
          noChecksums : {
            title        : 'Disable microservices checksum, this will make the deployment sequence considerably slower',
            flag         : 'n',
            required     : false,
            boolean      : true,
            defaultValue : false
          }
        },
        examples    : [
          '--name my-first-project --template aws-api-nodejs',
          '--name my-first-project --template aws-api-nodejs --noChecksum true'
        ]
      }
    ];
  }
}

module.exports = ProjectCreateCmd;
