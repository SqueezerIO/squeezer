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

      this.sqz.cli.log.debug(`# Starting CLI lifecycle : [ ${hooks.join(colors.green(' , '))} ]`);

      Promise.each(hooks, (val) => {
        const hook = _.find(this.sqz.vars.hooks, { identifier : val });

        this.sqz.cli.log.debug(`# Running lifecycle event "${val}"`);

        if (!hook) {
          this.sqz.cli.log.error(`No hook available for the lifecycle event ${colors.blue.bold(val)}`);
        }

        const Class = require(`${hook.path}`);
        const fn    = new Class(this.sqz);

        if (typeof fn[hook.function] !== 'function') {
          this.sqz.cli.log.error(
            `No hook function ${colors.blue.bold(hook.function)} available on ${colors.blue.bold(hook.path)}`
          );
        }

        const ret = fn[hook.function]();

        if (!ret || typeof ret.then !== 'function') {
          this.sqz.cli.log.warn(`Function ${colors.blue.bold(hook.function)} for hook ${colors.blue.bold(hook.identifier)} should be a Promise`);
        }

        return ret;
      }).then(() => {
        this.sqz.cli.log.debug('CLI lifecycle finished.');
        resolve();
      });
    });
  }

  sortHooks(hooks) {
    const baseHooks    = hooks.filter(val => (['before', 'after'].indexOf(val.split(':')[0]) < 0));
    const pluginHooks = hooks.filter(val => (['before', 'after'].indexOf(val.split(':')[0]) > -1));

    const findBaseHook = (pluginHook) => {
      const lastIndex = -1;
      let baseHook = null;

      _.forEach(baseHooks, (val) => {
        const index = pluginHook.indexOf(val);
        if (index > lastIndex) {
          baseHook = val;
        }
      });

      return baseHook;
    };

    pluginHooks.forEach((hook) => {
      const spl              = hook.split(':');
      const hookType = spl[0];
      const baseHook     =  findBaseHook(hook);
      const baseHookPosition = baseHooks.indexOf(baseHook);
      const pluginHook = hook.replace(`${hookType}:${baseHook}:`, '');

      if (hookType === 'before') {
        if (baseHookPosition > -1) {
          baseHooks.splice(baseHookPosition, 0, pluginHook);
        }
      }

      if (hookType === 'after') {
        if (baseHookPosition > -1) {
          baseHooks.splice(baseHookPosition + 1, 0, pluginHook);
        }
      }
    });

    return baseHooks;
  }
}

module.exports = Lifecycle;
