'use strict';

const _      = require('lodash');
const colors = require('colors');

/**
 * Class that compiles some reuirements needed for deployment
 */
class Validate {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Validate stages
   *
   * @param stages
   * @returns {boolean}
   */
  stage(stages) {
    const stage = this.sqz.vars.stage;

    if (!_.isEmpty(stages)) {
      if (!_.includes(stages, stage)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if Node defined project's platform it's compatible with the current runtime
   */
  platform() {
    const projectRuntime = this.sqz.vars.project.runtime.name;
    const versionCheck    = (projectVersion, runtimeVersion) => {
      if (projectVersion !== runtimeVersion) {
        this.sqz.cli.log.warn(
          `"${projectRuntime}" runtime version "${runtimeVersion}" is different from ` +
          `the one specified in the project's config "${projectVersion}"`
        );
      }
    };

    const types = {
      nodejs : {
        fn : () => {
          const projectVersionSplit = this.sqz.vars.project.runtime.version.toString().replace(/[^0-9.]/gi, '').split('.');
          const projectVersion = `${projectVersionSplit[0]}.${projectVersionSplit[1]}`;
          const runtimeVersionSplit = process.version.toString().replace(/[^0-9.]/gi, '').split('.');
          const runtimeVersion = `${runtimeVersionSplit[0]}.${runtimeVersionSplit[1]}`;

          versionCheck(projectVersion, runtimeVersion);
        }
      }
    };
    types[projectRuntime].fn();
  }
}

module.exports = Validate;
