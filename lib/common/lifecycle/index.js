/* eslint-disable global-require */

'use strict';

const colors  = require('colors');
const Promise = require('bluebird');
const _       = require('lodash');

/**
 * Class that manages CLI's lifecycle
 */
class Lifecycle {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Run each event from the lifecycle
   *
   * @param {Array} lifecycle - lifecycle array
   */
  run(lifecycle) {
    return new Promise((resolve) => {
      const hooks = this.sortHooks(lifecycle);

      this.sqz.cli.log.debug(`# Starting CLI lifecycle : [ ${colors.blue.bold(hooks.join(colors.green(' , ')))} ]`);

      Promise.each(hooks, (val) => {
        const hook = _.find(this.sqz.vars.hooks, { identifier : val });

        this.sqz.cli.log.debug(`# Running lifecycle event ${colors.blue.bold(val)}`);

        if (!hook) {
          this.sqz.cli.log.error(`No hook available for the lifecycle event ${colors.blue.bold(val)}`);
        }

        const Class = require(`${hook.path}`);
        const fn    = new Class(this.sqz);

        if (typeof fn[hook.function] !== 'function') {
          this.sqz.cli.log.error(
            `No hook function ${colors.blue.bold(hook.function)} available on ${colors.blue.bold(`../../../lib/${hook.path}`)}`
          );
        }

        const ret = fn[hook.function]();

        if (!ret || typeof ret.then !== 'function') {
          this.sqz.cli.log.error(`Function ${colors.blue.bold(hook.function)} for hook ${colors.blue.bold(hook.identifier)} should be a Promise`);
        }

        return ret;
      }).then(() => {
        this.sqz.cli.log.debug('CLI lifecycle finished.');
        resolve();
      });
    });
  }

  sortHooks(hooks) {
    const cleanHooks    = hooks.filter(val => (['before', 'after'].indexOf(val.split(':')[0]) < 0));
    const priorityHooks = hooks.filter(val => (['before', 'after'].indexOf(val.split(':')[0]) > -1));

    priorityHooks.forEach((hook) => {
      const spl              = hook.split(':');
      const firstHookElement = spl[0];
      const restHookPart     = spl.slice(1).join(':');
      const restHookPosition = cleanHooks.indexOf(restHookPart);

      if (firstHookElement === 'before') {
        if (restHookPosition > -1) {
          cleanHooks.splice(restHookPosition, 0, hook);
        }
      }

      if (firstHookElement === 'after') {
        if (restHookPosition > -1) {
          cleanHooks.splice(restHookPosition + 1, 0, hook);
        }
      }
    });

    return cleanHooks;
  }
}

module.exports = Lifecycle;
