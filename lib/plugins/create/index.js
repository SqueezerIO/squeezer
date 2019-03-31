'use strict';

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
            required     : false,
            defaultValue : 'my-first-project'
          },
          template    : {
            title        : 'Project\'s template , get available templates : "sqz templates"',
            flag         : 't',
            required     : true,
            defaultValue : null
          },
          noChecksums : {
            title        : 'Disable functions checksum, this will make the deployment sequence considerably slower',
            flag         : 'n',
            required     : false,
            boolean      : true,
            defaultValue : false
          }
        },
        examples    : [
          '--project my-first-project --template api-nodejs',
          '--project my-first-project --template api-nodejs --noChecksum true'
        ]
      }
    ];
  }
}

module.exports = ProjectCreateCmd;
