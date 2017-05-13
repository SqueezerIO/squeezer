'use strict';

/**
 * Class for CLI params orchestration
 */
class Params {
  constructor(sqz) {
    this.sqz    = sqz;
    this.params = this.parse(process.argv.slice(2));
  }

  /**
   * Set CLI params object
   * @name this.sqz.cli.params.set
   */
  set(params) {
    this.params = params;
  }

  /**
   * Set an option value
   * @name this.sqz.cli.params.setOption
   */
  setOption(name, value) {
    if (!this.params.options[name]) {
      this.params.options[name] = value;
    }
  }


  /**
   * Return CLI params
   * @returns {Object}
   * @name this.sqz.cli.params.get
   */
  get() {
    return this.params;
  }

  /**
   * Return CLI params
   * @returns {Object}
   * @name this.sqz.cli.params.get
   */
  parse(args) {
    let commands = args.shift();
    commands     = commands ? commands.split(':') : [];

    const raw = args.join(' ');

    let curArgType = 'args';
    args           = args.reduce((argsRet, val) => {
      let newArg = false;

      ['flags', 'options'].forEach((argType) => {
        if (val[0] === '-') {
          val        = val.substr(1);
          curArgType = argType;
          newArg     = true;
        }
      });

      newArg && argsRet[curArgType].push([val]); // eslint-disable-line no-unused-expressions
      if (!newArg) {
        if (curArgType === 'args') {
          argsRet[curArgType].push(val);
        } else {
          argsRet[curArgType][argsRet[curArgType].length - 1].push(val);
        }
      }

      return argsRet;
    }, {
      names   : commands,
      args    : [],
      flags   : [],
      options : [],
      buffer  : new Buffer(raw)
    });

    ['flags', 'options'].forEach((argType) => {
      args[argType] = args[argType].reduce((obj, arr) => {
        obj[arr[0]] = arr.slice(1)[0] || null;

        return obj;
      }, {});
    });

    return args;
  }
}

module.exports = Params;
