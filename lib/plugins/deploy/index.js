'use strict';

class DeployPluginIndex {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['deploy'],
        summary     : 'Deploys the current project into the cloud.',
        description : '',
        lifecycle   : [
          'project:validate',
          'functions:load',
          'project:info',
          'cloud:init',
          'cloud:credentials:validate',
          'cloud:compile',
          'deploy:checksums:get',
          'deploy:compile',
          'cloud:deploy',
          'cloud:deploy:assets',
          'deploy:checksums:save'
        ],
        options     : {
          function : {
            title        : 'function name',
            flag         : 'f',
            description  : 'Deploys only a specific function',
            value        : true,
            required     : false,
            defaultValue : null
          },
          stage        : {
            title        : 'environment stage',
            description  : '',
            value        : true,
            required     : false,
            defaultValue : 'dev'
          },
          force        : {
            title        : 'force to deploy',
            description  : 'Force a deployment even if there is no any code changes',
            value        : false,
            required     : false,
            defaultValue : null
          }
        },
        examples    : [
          '',
          '--stage dev',
          '--force',
          '--function my-function'
        ]
      }
    ];
  }
}

module.exports = DeployPluginIndex;
