'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var appRoot = require('app-root-path');
var CloudsInfo = require(appRoot + '/lib/clouds/info');
var CommonUtils = require(appRoot + '/lib/common/utils');
var CommonSettings = require(appRoot + '/lib/common/settings');
var CommonCliError = require(appRoot + '/lib/common/cli/error');
var CommonCliLog = require(appRoot + '/lib/common/cli/log');
var CommonCliParams = require(appRoot + '/lib/common/cli/params');
var CommonCliHelp = require(appRoot + '/lib/common/cli/help');
var TasksVersion = require(appRoot + '/lib/tasks/version');
var TasksConfig = require(appRoot + '/lib/tasks/config');

var Squeezer = function () {
  function Squeezer() {
    _classCallCheck(this, Squeezer);
  }

  _createClass(Squeezer, [{
    key: 'init',
    value: function init() {
      this.clouds = {};
      this.clouds.info = new CloudsInfo(this);

      this.common = {};
      this.common.settings = new CommonSettings(this);
      this.common.utils = new CommonUtils(this);

      this.common.cli = {};
      this.common.cli.params = new CommonCliParams(this);
      this.common.cli.error = new CommonCliError(this);
      this.common.cli.log = new CommonCliLog(this);
      this.common.cli.help = new CommonCliHelp(this);

      this.tasks = {};
      this.tasks.version = new TasksVersion(this);
      this.tasks.config = new TasksConfig(this);
    }
  }]);

  return Squeezer;
}();

module.exports = new Squeezer();


/* eslint global-require: 0 */
/* eslint no-console: 0 */

'use strict';

console.log(__dirname);

try {
  var appRoot = require('app-root-path');
  var sqz = require(appRoot + '/cli/Squeezer');

  sqz.init();

  var CLI = require(appRoot + '/cli/cli');
  var updateNotifier = require('update-notifier');
  var pkg = require(appRoot + '/package.json');

  updateNotifier({ pkg: pkg }).notify();
  CLI.run(process.argv.slice(2));
} catch (e) {
  var _appRoot = require('app-root-path');
  var Err = require(_appRoot + '/lib/common/cli/error');

  var err = new Err();

  console.log(err.get(e, true));

  process.exit(1);
}
'use strict';

var CommandLineInterface = require('./interface');

var CLI = new CommandLineInterface();

CLI.load(__dirname, './commands');

module.exports = CLI;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author Keith Horwood <jsmith@keithwhor@gmail.com>
 */

/* eslint no-unreachable: 0 */

module.exports = function () {
  'use strict';

  var Command = function () {
    function Command() {
      _classCallCheck(this, Command);

      var args = [].slice.call(arguments);
      this.names = args;
    }

    _createClass(Command, [{
      key: 'help',
      value: function help() {
        return {};

        /* Example below */

        return {
          description: 'No information available',
          args: ['example'],
          flags: { i: 'Information Flag' },
          vflags: { iverbose: 'Verbose Information Flag' }
        };
      }
    }, {
      key: 'run',
      value: function run(params) {
        return params;
      }
    }]);

    return Command;
  }();

  return Command;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var appRoot = require('app-root-path');
var Command = require(appRoot + '/cli/command');
var sqz = require(appRoot + '/cli/Squeezer');
var _ = require('lodash');
var colors = require('colors');

var ConfigCommand = function (_Command) {
  _inherits(ConfigCommand, _Command);

  function ConfigCommand() {
    _classCallCheck(this, ConfigCommand);

    var _this = _possibleConstructorReturn(this, (ConfigCommand.__proto__ || Object.getPrototypeOf(ConfigCommand)).call(this, 'clouds', 'aws', 'cloudformation', 'add_resource'));

    _this.cmdData = {
      summary: 'Adds an AWS Cloud Formation template resource',
      description: null
    };
    return _this;
  }

  _createClass(ConfigCommand, [{
    key: 'help',
    value: function help() {
      return this.cmdData;
    }
  }, {
    key: 'run',
    value: function run(params) {}
  }]);

  return ConfigCommand;
}(Command);

module.exports = ConfigCommand;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var appRoot = require('app-root-path');
var Command = require(appRoot + '/cli/command');
var sqz = require(appRoot + '/cli/Squeezer');
var _ = require('lodash');
var colors = require('colors');

var ConfigCommand = function (_Command) {
  _inherits(ConfigCommand, _Command);

  function ConfigCommand() {
    _classCallCheck(this, ConfigCommand);

    var _this = _possibleConstructorReturn(this, (ConfigCommand.__proto__ || Object.getPrototypeOf(ConfigCommand)).call(this, 'clouds', 'info'));

    _this.cmdData = {
      summary: 'List available microservices clouds information',
      description: null
    };
    return _this;
  }

  _createClass(ConfigCommand, [{
    key: 'help',
    value: function help() {
      return this.cmdData;
    }
  }, {
    key: 'run',
    value: function run(params) {
      var spacer = ' '.repeat(3);
      //console.log(sqz.clouds.info.get())
      //const 
      //sqz.tasks.config.set(params.vflags.setting[0], params.vflags.value[0]);
      //sqz.common.cli.log.info('Setting successfully configured!\n');
      _.forEach(sqz.clouds.info.get(), function (value, key) {
        //console.log(key)
        sqz.common.cli.log.console(spacer + '[' + colors.yellow.bold(key) + ']\n');
        sqz.common.cli.log.console('' + spacer + colors.yellow(value.title));
        sqz.common.cli.log.console('\n' + spacer + 'Languages:\n' + spacer + colors.green(value.languages.join(' , ')) + '\n');
      });
    }
  }]);

  return ConfigCommand;
}(Command);

module.exports = ConfigCommand;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var appRoot = require('app-root-path');
var Command = require(appRoot + '/cli/command');
var sqz = require(appRoot + '/cli/Squeezer');

var ConfigCommand = function (_Command) {
  _inherits(ConfigCommand, _Command);

  function ConfigCommand() {
    _classCallCheck(this, ConfigCommand);

    var _this = _possibleConstructorReturn(this, (ConfigCommand.__proto__ || Object.getPrototypeOf(ConfigCommand)).call(this, 'config', 'set'));

    _this.cmdData = {
      summary: 'Stores a setting into config',
      description: 'Adds a setting which will be stored to the ~/.sqzrc file',
      vflags: {
        setting: {
          title: 'setting name',
          required: true,
          defaultValue: null
        },
        value: {
          title: 'setting value',
          required: true,
          defaultValue: null
        }
      },
      examples: ['--setting deploymentKey --value 7f98f187c70656995268f239a6edd94c']
    };
    return _this;
  }

  _createClass(ConfigCommand, [{
    key: 'help',
    value: function help() {
      return this.cmdData;
    }
  }, {
    key: 'run',
    value: function run(params) {
      sqz.tasks.config.set(params.vflags.setting[0], params.vflags.value[0]);
      sqz.common.cli.log.info('Setting successfully configured!\n');
    }
  }]);

  return ConfigCommand;
}(Command);

module.exports = ConfigCommand;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var appRoot = require('app-root-path');
var Command = require(appRoot + '/cli/command');
var sqz = require(appRoot + '/cli/Squeezer');
var _ = require('lodash');
var colors = require('colors');

var HelpCommand = function (_Command) {
  _inherits(HelpCommand, _Command);

  function HelpCommand() {
    _classCallCheck(this, HelpCommand);

    var _this = _possibleConstructorReturn(this, (HelpCommand.__proto__ || Object.getPrototypeOf(HelpCommand)).call(this, 'help'));

    _this.cmdData = {
      summary: 'Displays help for a specific command',
      description: null,
      examples: []
    };
    return _this;
  }

  _createClass(HelpCommand, [{
    key: 'help',
    value: function help() {
      return this.cmdData;
    }
  }, {
    key: 'all',
    value: function all() {
      var _this2 = this;

      this.commands = sqz.common.cli.commands;

      var commands = Object.keys(this.commands);
      var largestCmdLen = 0;
      var singleCommands = [];
      var groupedCommands = {};
      var msg = '';

      commands.filter(function (cmd) {
        return _this2.commands[cmd].help().summary;
      }).sort().map(function (cmd) {
        var cmdLen = cmd.length;
        var groupName = void 0;

        if (cmdLen > largestCmdLen) largestCmdLen = cmdLen;

        if (cmd.indexOf(':') < 0) {
          singleCommands.push(cmd);
        } else {
          groupName = cmd.split(':')[0];

          if (!_.isArray(groupedCommands[groupName])) groupedCommands[groupName] = [];
          groupedCommands[groupName].push(cmd);
        }
      });

      msg += colors.yellow(' '.repeat(3) + 'Available commands:\n');

      _.forEach(singleCommands, function (cmd) {
        msg += colors.green('' + ' '.repeat(5) + cmd + ' '.repeat(largestCmdLen - cmd.length + 1)) + (_this2.commands[cmd].help().summary + '\n');
      });

      _.forEach(groupedCommands, function (cmds, group) {
        msg += colors.yellow('' + ' '.repeat(3) + group + '\n');
        _.forEach(cmds, function (key) {
          msg += colors.green('' + ' '.repeat(5) + key + ' '.repeat(largestCmdLen - key.length + 1)) + (_this2.commands[key].help().summary + '\n');
        });
      });

      return msg;
    }
  }, {
    key: 'run',
    value: function run(params) {
      sqz.common.cli.log.console(sqz.common.cli.help.get(sqz.common.cli.commands, params.args[0]));
    }
  }]);

  return HelpCommand;
}(Command);

module.exports = HelpCommand;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var appRoot = require('app-root-path');
var Command = require(appRoot + '/cli/command');
var sqz = require(appRoot + '/cli/Squeezer');
var colors = require('colors/safe');

var VersionCommand = function (_Command) {
  _inherits(VersionCommand, _Command);

  function VersionCommand() {
    _classCallCheck(this, VersionCommand);

    var _this = _possibleConstructorReturn(this, (VersionCommand.__proto__ || Object.getPrototypeOf(VersionCommand)).call(this));

    _this.cmdData = {
      summary: null,
      description: null,
      vflags: {},
      examples: []
    };
    return _this;
  }

  _createClass(VersionCommand, [{
    key: 'run',
    value: function run() {
      var msg = '\n      * Lists all commands ' + colors.green('`sqz list`') + '.\n      * Displays help for a command ' + colors.green('`sqz help [command]`') + '.\n      * You can add ' + colors.green('--verbose') + ' to any command for more CLI details\n      * Squeezer framework documentation: ' + colors.cyan('docs.squeezer.io') + '\n    ';

      sqz.common.cli.log.console(msg.replace(/^\s+/gm, ' '.repeat(3)));
    }
  }]);

  return VersionCommand;
}(Command);

module.exports = VersionCommand;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var appRoot = require('app-root-path');
var Command = require(appRoot + '/cli/command');
var sqz = require(appRoot + '/cli/Squeezer');
var _ = require('lodash');
var colors = require('colors');

var ListCommand = function (_Command) {
  _inherits(ListCommand, _Command);

  function ListCommand() {
    _classCallCheck(this, ListCommand);

    var _this = _possibleConstructorReturn(this, (ListCommand.__proto__ || Object.getPrototypeOf(ListCommand)).call(this, 'list'));

    _this.cmdData = {
      summary: 'Lists all commands',
      description: null,
      examples: []
    };
    return _this;
  }

  _createClass(ListCommand, [{
    key: 'help',
    value: function help() {
      return this.cmdData;
    }
  }, {
    key: 'run',
    value: function run(params) {
      var _this2 = this;

      this.commands = sqz.common.cli.commands;

      var commands = Object.keys(this.commands);
      var largestCmdLen = 0;
      var singleCommands = [];
      var groupedCommands = {};
      var msg = '';

      commands.filter(function (cmd) {
        return _this2.commands[cmd].help().summary;
      }).sort().map(function (cmd) {
        var cmdLen = cmd.length;
        var groupName = void 0;

        if (cmdLen > largestCmdLen) largestCmdLen = cmdLen;

        if (cmd.indexOf(':') < 0) {
          singleCommands.push(cmd);
        } else {
          groupName = cmd.split(':')[0];

          if (!_.isArray(groupedCommands[groupName])) groupedCommands[groupName] = [];
          groupedCommands[groupName].push(cmd);
        }
      });

      msg += colors.yellow(' '.repeat(3) + 'Options:\n');
      msg += colors.green(' '.repeat(5) + '--verbose') + (' '.repeat(largestCmdLen - '--verbose'.length + 1) + 'be verbose\n');
      msg += colors.yellow(' '.repeat(3) + 'Available commands:\n');

      _.forEach(singleCommands, function (cmd) {
        msg += colors.green('' + ' '.repeat(5) + cmd + ' '.repeat(largestCmdLen - cmd.length + 1)) + (_this2.commands[cmd].help().summary + '\n');
      });

      _.forEach(groupedCommands, function (cmds, group) {
        msg += colors.yellow('' + ' '.repeat(3) + group + '\n');
        _.forEach(cmds, function (key) {
          msg += colors.green('' + ' '.repeat(5) + key + ' '.repeat(largestCmdLen - key.length + 1)) + (_this2.commands[key].help().summary + '\n');
        });
      });

      sqz.common.cli.log.console(msg);
    }
  }]);

  return ListCommand;
}(Command);

module.exports = ListCommand;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var appRoot = require('app-root-path');
var Command = require(appRoot + '/cli/command');
var sqz = require(appRoot + '/cli/Squeezer');
var _ = require('lodash');
var colors = require('colors');

var ConfigCommand = function (_Command) {
  _inherits(ConfigCommand, _Command);

  function ConfigCommand() {
    _classCallCheck(this, ConfigCommand);

    var _this = _possibleConstructorReturn(this, (ConfigCommand.__proto__ || Object.getPrototypeOf(ConfigCommand)).call(this, 'microservice', 'create'));

    _this.cmdData = {
      summary: 'Creates a microservice',
      description: null,
      vflags: {
        name: {
          title: 'microservice name',
          required: true,
          defaultValue: null
        },
        cloud: {
          title: 'microservice cloud type',
          required: true,
          defaultValue: null
        },
        lang: {
          title: 'microservice language',
          required: true,
          defaultValue: null
        }
      },
      examples: ['--name my-first-microservice --cloud aws --lang nodejs']
    };
    return _this;
  }

  _createClass(ConfigCommand, [{
    key: 'help',
    value: function help() {
      return this.cmdData;
    }
  }, {
    key: 'run',
    value: function run(params) {}
  }]);

  return ConfigCommand;
}(Command);

module.exports = ConfigCommand;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var appRoot = require('app-root-path');
var Command = require(appRoot + '/cli/command');
var sqz = require(appRoot + '/cli/Squeezer');

var HelpCommand = function (_Command) {
  _inherits(HelpCommand, _Command);

  function HelpCommand() {
    _classCallCheck(this, HelpCommand);

    var _this = _possibleConstructorReturn(this, (HelpCommand.__proto__ || Object.getPrototypeOf(HelpCommand)).call(this, 'version'));

    _this.cmdData = {
      summary: 'Shows information of your currently globally installed Squeezer CLI',
      description: null
    };
    return _this;
  }

  _createClass(HelpCommand, [{
    key: 'help',
    value: function help() {
      return this.cmdData;
    }
  }, {
    key: 'run',
    value: function run() {
      var colors = sqz.common.utils.colors();

      var msg = colors.green.bold(sqz.tasks.version.msg(), '\n');

      sqz.common.cli.log.console(msg);
    }
  }]);

  return HelpCommand;
}(Command);

module.exports = HelpCommand;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author Keith Horwood <jsmith@keithwhor@gmail.com>
 * @author Nick Chisiu <chisiu_nicolae@yahoo.com>
 */
var appRoot = require('app-root-path');
var sqz = require(appRoot + '/cli/Squeezer');
var fs = require('fs');
var path = require('path');
var colors = require('colors/safe');
var _ = require('lodash');
var settings = require(appRoot + '/package.json');
var bin = Object.keys(settings.bin)[0];

/* eslint no-param-reassign: 0, no-shadow: 0, prefer-template : 0 */

module.exports = function () {
  'use strict';

  var CommandLineInterface = function () {
    function CommandLineInterface() {
      _classCallCheck(this, CommandLineInterface);

      this.commands = {};
    }

    _createClass(CommandLineInterface, [{
      key: 'parse',
      value: function parse(args) {
        var commands = args.shift();
        commands = commands ? commands.split(':') : [];

        var raw = args.join(' ');

        var curArgType = 'args';
        args = args.reduce(function (args, val) {
          var newArg = false;

          ['flags', 'vflags'].forEach(function (argType) {
            if (val[0] === '-') {
              val = val.substr(1);
              curArgType = argType;
              newArg = true;
            }
          });

          newArg && args[curArgType].push([val]); // eslint-disable-line no-unused-expressions
          if (!newArg) {
            if (curArgType === 'args') {
              args[curArgType].push(val);
            } else {
              args[curArgType][args[curArgType].length - 1].push(val);
            }
          }

          return args;
        }, {
          names: commands,
          args: [],
          flags: [],
          vflags: [],
          buffer: new Buffer(raw)
        });

        ['flags', 'vflags'].forEach(function (argType) {
          args[argType] = args[argType].reduce(function (obj, arr) {
            obj[arr[0]] = arr.slice(1);

            return obj;
          }, {});
        });

        return args;
      }
    }, {
      key: 'load',
      value: function load(root, dir) {
        var _this = this;

        fs.readdirSync(path.join(root, dir)).forEach(function (filename) {
          if (filename.indexOf('.') === 0) {
            return;
          }

          var pathname = path.join(dir, filename);
          var fullpath = path.join(root, pathname);

          var stat = fs.statSync(fullpath);

          if (stat.isDirectory()) {
            _this.load(root, pathname);
          } else {
            _this.add(require(fullpath)); // eslint-disable-line global-require
          }
        });
      }
    }, {
      key: 'add',
      value: function add(CommandConstructor) {
        var command = new CommandConstructor();
        this.commands[this.format(command.names)] = command;
      }
    }, {
      key: 'get',
      value: function get() {
        return this.commands;
      }
    }, {
      key: 'format',
      value: function format(names) {
        return names.join(':');
      }
    }, {
      key: 'validate',
      value: function validate(cmdData, args) {
        if (!cmdData) return args;

        var helpCmdMsg = colors.red('\n\n    $ ' + bin + ' help ' + args.names.join(':'));

        _.forEach(cmdData.vflags, function (value, key) {
          if (value.required === true) {
            if (_.has(args.vflags, key) === false) {
              sqz.common.cli.log.error(' Missing argument ' + colors.green('--' + key) + '  ' + helpCmdMsg);
            } else if (args.vflags[key].length === 0) {
              sqz.common.cli.log.error(' Missing argument ' + colors.green('--' + key) + ' ' + (colors.red('value') + ' ' + helpCmdMsg));
            }
          } else {
            if (value.defaultValue) {
              // eslint-disable-line no-lonely-if
              args.vflags[key] = [value.defaultValue];
            }
          }
        });

        return args;
      }
    }, {
      key: 'run',
      value: function run(args) {
        args = this.parse(args);

        var command = this.commands[this.format(args.names)];
        var hintCmd = args.names[0] === 'help' ? args.args[0] : args.names.join(':');

        var errorMsg = 'Command "' + colors.green(hintCmd) + '" not found  ... \n';
        var availableHelpCmds = [];

        var spacer = ' '.repeat(3);
        var cliVersion = '' + colors.yellow('CLI v' + settings.version);

        /**
         * ascii art generated with help of :
         * http://patorjk.com/software/taag/#p=display&f=Rectangles&t=Type%20Something%20
         */
        var logo = '';
        logo = '' + logo + spacer + '                                         _\n';
        logo = '' + logo + spacer + ' ___ ___ _ _ ___ ___ ___ ___ ___        |_|___\n';
        logo = '' + logo + spacer + '|_ -| . | | | -_| -_|- _| -_|  _|   _   | | . |\n';
        logo = '' + logo + spacer + '|___|_  |___|___|___|___|___|_|    |_|  |_|___|\n';
        logo = '' + logo + spacer + '      |_|                             ' + cliVersion + '\n';

        sqz.common.cli.log.console(logo);

        if (args.names[0] === 'help' && args.args.length === 0) {
          sqz.common.cli.log.error('Missing help command argument , please use ' + ('' + colors.green('`' + bin + ' help [command]`')) + ('\n\n   ... or ' + colors.green('`' + bin + ' list`') + ' to get all available commands'));
        }

        if (!this.commands[hintCmd] || !command) {
          Object.keys(this.commands).map(function (cmd) {
            if (cmd.indexOf(hintCmd) >= 0) {
              availableHelpCmds.push(cmd);
            }
          });

          if (availableHelpCmds.length > 0) {
            errorMsg += colors.green('\n' + ' '.repeat(3) + 'Did you mean one of these commands?\n\n');
            errorMsg += '' + ' '.repeat(6) + colors.red(availableHelpCmds.join('\n' + ' '.repeat(6)));
          }

          sqz.common.cli.log.error(errorMsg);
        }

        args = this.validate(command.cmdData, args);
        sqz.common.cli.commands = this.commands;
        sqz.common.cli.params.set(args);

        var params = {
          args: args.args,
          flags: args.flags,
          vflags: args.vflags,
          buffer: args.buffer
        };

        return command.run(params);
      }
    }]);

    return CommandLineInterface;
  }();

  return CommandLineInterface;
}();
'use strict';

/**
 * Class representing Squeezer  microservices clouds information
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Settings = function () {
  function Settings(sqz) {
    _classCallCheck(this, Settings);

    this.sqz = sqz;

    this.info = {
      aws: {
        title: 'Amazon Web Services',
        languages: ['nodejs', 'python', 'java']
      }
      // azure : {
      //   title : 'Microsoft Azure',
      //   languages : [ 'c#', 'javascript', 'python', 'php' ]
      // }
    };
  }

  /**
   * Returns clouds information data
   * @returns {Object}
   * @example
   *
   * sqz.common.info.get()
   *
   * Returns :
   *
   * {
   *      aws : {
   *        title     : 'Amazon Web Services',
   *        platforms : [ 'nodejs', 'python', 'java' ]
   *      }
   *      ,
   *      azure : {
   *        title : 'Microsoft azure',
   *        platforms : [ 'c#', 'nodejs', 'python', 'php' ]
   *      }
   * }
   */


  _createClass(Settings, [{
    key: 'get',
    value: function get() {
      return this.info;
    }
  }]);

  return Settings;
}();

module.exports = Settings;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var appRoot = require('app-root-path');
var Version = require(appRoot + '/lib/tasks/version');
var colors = require('colors');
var _ = require('lodash');

/**
 * Class that manage errors of all types.
 */

var Error = function () {
  function Error() {
    _classCallCheck(this, Error);
  }

  _createClass(Error, [{
    key: 'get',

    /**
     * Returns formatted error message
     * @param {string} error - error message
     * @param {boolean} noSqzError - true for system error
     * @returns {String}
     * @example
     *
     * sqz.common.cli.error.get("THIS IS ERROR")
     * 
     * 
     *                                          _
     *  ___ ___ _ _ ___ ___ ___ ___ ___        |_|___
     * |_ -| . | | | -_| -_|- _| -_|  _|   _   | | . |
     * |___|_  |___|___|___|___|___|_|    |_|  |_|___|
     *       |_|                             CLI vX.X.X
     *
     * SQUEEZER ERROR:
      * THIS IS ERROR
      * ### Docs: docs.squeezer.io
     * ### Bugs: github.com/SqueezerIO/squeezer-cli/issues
     * 
     */
    value: function get(errorParam, noSqzError) {
      var error = errorParam;

      if (_.has(error, 'stack') && noSqzError) error = error.stack;

      var versionInfo = new Version();
      var spacer = ' '.repeat(3);
      var msg = '';

      if (noSqzError) {
        msg += '\n\n   ' + colors.red(error) + '\n\n';
      } else {
        msg += '\n\n   ' + error + '\n\n';
      }

      if (noSqzError) {
        msg += colors.yellow.bold(versionInfo.msg()) + '\n\n';
        msg += spacer + 'You can add ' + colors.green('--verbose') + ' to any command for more CLI details\n\n';
      }

      msg += spacer + '### Docs: ' + colors.cyan('docs.squeezer.io') + '\n' + (spacer + '### Bugs: ' + colors.cyan('github.com/SqueezerIO/squeezer-cli/issues'));

      if (noSqzError) {
        msg += '' + colors.red.bold('\n\n   ### If you feel that this error it\'s ' + 'a bug please report it . Thank you !');
      }

      msg += '\n';

      return msg;
    }
  }]);

  return Error;
}();

module.exports = Error;
'use strict';

var expect = require('chai').expect;

module.exports = function (sqz) {
  describe('sqz.common.cli.error.get()', function () {
    it('should contain something', function () {
      expect(sqz.common.cli.error.get('DISPLAY THIS')).to.contain('DISPLAY THIS');
    });
  });
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var appRoot = require('app-root-path');
var colors = require('colors');
var _ = require('lodash');
var bin = Object.keys(require(appRoot + '/package.json').bin)[0];

/**
 * Class which builds the help message  .
 */

var Help = function () {
  /**
   * @param {Object} sqz - Squeezer CLI instance
   */
  function Help(sqz) {
    _classCallCheck(this, Help);

    this.sqz = sqz;
  }

  /**
   * Return current version information
   * @returns {Object}
   * @example
   *
   * sqz.tasks.help.get()
   *
   * Returns :
   *
   * {
   *    squeezerCliVersion: 'v1.1.0',
   *    nodeVersion: 'v6.4.0',
   *    osPlatform: 'darwin'
   * }
   */


  _createClass(Help, [{
    key: 'get',
    value: function get(commands, param) {
      var cmd = commands[param];
      var spacer = ' '.repeat(3);
      var spacerSub = ' '.repeat(4);
      var desc = cmd.cmdData.description || cmd.cmdData.summary;
      var msg = '';
      var maxOptionLen = 0;

      msg += '' + spacer + colors.yellow('Usage: ') + '\n\n';
      msg += spacerSub + '$ ' + bin + ' ' + param + ' ' + (cmd.cmdData.vflags ? '[options]' : '') + '\n\n';

      msg += '' + spacer + colors.yellow('Description:') + '\n\n';
      msg += desc.replace(/^/gm, spacerSub) + '\n\n';

      if (cmd.cmdData.vflags) {
        msg += '' + spacer + colors.yellow('Options:') + '\n\n';

        _.forEach(cmd.cmdData.vflags, function (value, key) {
          if (key.length > maxOptionLen) maxOptionLen = key.length;
        });

        _.forEach(cmd.cmdData.vflags, function (value, key) {
          msg += '' + spacerSub + colors.green('--' + key) + ' '.repeat(maxOptionLen - key.length + 3);
          msg += value.title + ' ' + (value.required ? '(required)' : '(optional)') + ' ';
          msg += '' + (value.defaultValue ? colors.yellow('[default: "' + value.defaultValue + '"]') : '');
          msg += '\n';
        });
      }

      if (cmd.cmdData.examples && cmd.cmdData.examples.length > 0) {
        msg += '\n' + spacer + colors.yellow('Examples:') + '\n\n';

        _.forEach(cmd.cmdData.examples, function (example) {
          msg += spacerSub + '$ ' + bin + ' ' + param + ' ' + example + '\n';
        });
      }

      return msg;
    }
  }]);

  return Help;
}();

module.exports = Help;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var colors = require('colors');
var _ = require('lodash');

/**
 * Class that represents CLI logging.
 * @name sqz.common.log
 */

var Log = function () {
  function Log(sqz) {
    _classCallCheck(this, Log);

    this.sqz = sqz;
    this.repeater = ' '.repeat(3);
  }

  /**
   * Display's a CLI debug message
   * @param {string} msg - debug message
   */


  _createClass(Log, [{
    key: 'debug',
    value: function debug(msg) {
      var params = this.sqz.common.cli.params.list();

      if (_.has(params.vflags, 'debug')) {
        this.console('' + colors.yellow(this.repeater + 'DEBUG -> ') + colors.green(msg));
      }
    }

    /**
     * Display's a CLI warning message
     * @param {string} msg - warning message
     */

  }, {
    key: 'warn',
    value: function warn(msg) {
      this.console('' + colors.red.bold(this.repeater + 'WARN -> ') + colors.green(msg));
    }

    /**
     * Display's a CLI information message
     * @param {string} msg - information message
     */

  }, {
    key: 'info',
    value: function info(msg) {
      this.console('' + colors.yellow.bold(this.repeater + 'INFO -> ') + colors.green(msg));
    }

    /**
     * Display's a CLI error message ( and exists the CLI with terminal code 1 )
     * @param {string} msg - error message
     */

  }, {
    key: 'error',
    value: function error(msg) {
      this.console(colors.red.bold(this.repeater + 'SQUEEZER ERROR:') + this.sqz.common.cli.error.get(msg));
      process.exit(1);
    }

    /**
     * Use the same NodeJS console.log feature
     * @param {string} msg - information message
     */

  }, {
    key: 'console',
    value: function (_console) {
      function console(_x) {
        return _console.apply(this, arguments);
      }

      console.toString = function () {
        return _console.toString();
      };

      return console;
    }(function (msg) {
      console.log(msg); // eslint-disable-line no-console
    })
  }]);

  return Log;
}();

module.exports = Log;
'use strict';

/**
 * Class for CLI params orchestration
 * @name sqz.common.cli.params
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Params = function () {
  function Params(sqz) {
    _classCallCheck(this, Params);

    this.sqz = sqz;
    this.params = {};
  }

  /**
   * Set CLI params object
   */


  _createClass(Params, [{
    key: 'set',
    value: function set(params) {
      this.params = params;
    }

    /**
     * Return CLI params
     * @returns {Object}
     * @example
     *
     * sqz.common.cli.params.get()
     *
     * Returns :
     *
     * { names: [], args: [], flags: {}, vflags: {}, buffer: <Buffer > }
     */

  }, {
    key: 'get',
    value: function get() {
      return this.params;
    }
  }]);

  return Params;
}();

module.exports = Params;
'use strict';

var expect = require('chai').expect;

module.exports = function (sqz) {
  describe('sqz.common.cli.params.list()', function () {
    it('should be an object', function () {
      expect(sqz.common.cli.params.get()).to.be.an('object');
    });

    it('should deep contain something', function () {
      expect(sqz.common.cli.params.get().vflags).to.deep.equal({ msg: ['hello'] });
    });
  });
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var appRoot = require('app-root-path');
var settings = require(appRoot + '/package.json');

/**
 * Class representing package.json file derivation into settings Object .
 * @name sqz.common.settings
 */

var Settings = function () {
  function Settings(sqz) {
    _classCallCheck(this, Settings);

    this.sqz = sqz;
    this.settings = settings;
  }

  /**
   * Return all settings from the project's package.json file Object
   * @returns {Object}
   * @example
   *
   * sqz.common.settings.get()
   *
   * Returns :
   *
   * {
   *  "name"            : "squeezer-cli",
   *  "version"         : "1.1.0",
   *  "preferGlobal"    : true,
   *  "description"     : "Squeezer it's a framework designed to help back-end developers to get a better architecture on serverless zero-administration compute platforms with code that runs into [microservices](https://en.wikipedia.org/wiki/Microservices) clouds like [AWS Lambda](https://aws.amazon.com/documentation/lambda/) , [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) , [Google Cloud Functions](https://cloud.google.com/functions/docs/) and [IBM OpenWhisk](https://developer.ibm.com/openwhisk/) .",
   *  "homepage"        : "http://Squeezer.IO/",
   *  "bin"             : {
   *    "squeezer-cli" : "cli/bin.js",
   *    "squeezer"     : "cli/bin.js",
   *    "sqz"          : "cli/bin.js"
   *  },
   *  ...
   * }
   *   */


  _createClass(Settings, [{
    key: 'get',
    value: function get() {
      return this.settings;
    }

    /**
     * Override settings object
     * @name sqz.common.settings.set
     * @param {Object} settingsObject - settings object
     */

  }, {
    key: 'set',
    value: function set(settingsObject) {
      this.settings = settingsObject;
    }
  }]);

  return Settings;
}();

module.exports = Settings;
'use strict';

var expect = require('chai').expect;

module.exports = function (sqz) {
  describe('sqz.common.settings.get()', function () {
    it('should be an object', function () {
      expect(sqz.common.settings.get()).to.be.an('object');
    });

    it('should contain some keys', function () {
      expect(sqz.common.settings.get()).to.include.keys('version', 'name');
    });
  });
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var colors = require('colors/safe');
var lodash = require('lodash');
var walkSync = require('walk-sync');

/**
 * Class which offers some really useful tools
 * @name sqz.common.utils
 */

var Settings = function () {
  function Settings(sqz) {
    _classCallCheck(this, Settings);

    this.sqz = sqz;
    this.colorsPackage = colors;
    this.lodashPackage = lodash;
    this.walkSyncPackage = walkSync;
  }

  /**
   * colors package https://www.npmjs.com/package/colors
   * @returns {Object}
   */


  _createClass(Settings, [{
    key: 'colors',
    value: function colors() {
      return this.colorsPackage;
    }

    /**
     * lodash package https://www.npmjs.com/package/lodash
     * @returns {Object}
     */

  }, {
    key: 'lodash',
    value: function lodash() {
      return this.lodashPackage;
    }

    /**
     * walk-sync package https://www.npmjs.com/package/walk-sync
     * @returns {Object}
     */

  }, {
    key: 'walkSync',
    value: function walkSync() {
      return this.walkSyncPackage;
    }
  }]);

  return Settings;
}();

module.exports = Settings;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Settings = require('../../common/settings');

/**
 * Class which builds an Object for returning local version information  .
 * @name sqz.tasks.version
 */

var Version = function () {
  function Version(sqz) {
    _classCallCheck(this, Version);

    this.sqz = sqz;

    var settings = new Settings();

    this.versionData = {
      squeezerCliVersion: 'v' + settings.get().version,
      nodeVersion: process.version,
      osPlatform: process.platform
    };
  }

  /**
   * Return current version information
   * @returns {Object}
   * @example
   *
   * sqz.tasks.version.get()
   *
   * Returns :
   *
   * {
   *    squeezerCliVersion: 'v1.1.0',
   *    nodeVersion: 'v6.4.0',
   *    osPlatform: 'darwin'
   * }
   */


  _createClass(Version, [{
    key: 'get',
    value: function get() {
      return this.versionData;
    }

    /**
     * Return markdown formatted version message
     * @returns {Object}
     * @example
     *
     * sqz.tasks.version.msg()
     *
     * Returns :
     *
     * * Squeezer CLI version: v1.1.0
     * * Node version: v6.4.0
     * * OS platform: darwin
     */

  }, {
    key: 'msg',
    value: function msg() {
      var spacer = ' '.repeat(3);

      var msg = spacer + '* Squeezer CLI version: ' + this.versionData.squeezerCliVersion + '\n' + (spacer + '* Node version: ' + this.versionData.nodeVersion + '\n') + (spacer + '* OS platform: ' + this.versionData.osPlatform);

      return msg;
    }
  }]);

  return Version;
}();

module.exports = Version;
'use strict';

var expect = require('chai').expect;

module.exports = function (sqz) {
  describe('sqz.tasks.config.list()', function () {
    it('should be an object', function () {
      expect(sqz.tasks.config.list()).to.be.an('object');
    });
  });

  describe('sqz.tasks.config.set()', function () {
    it('should set a key', function () {
      sqz.tasks.config.set('testSetting', 'hello');
    });
  });

  describe('sqz.tasks.config.get()', function () {
    it('should get a value', function () {
      expect(sqz.tasks.config.get('testSetting')).to.equal('hello');
    });
  });

  describe('sqz.tasks.config.remove()', function () {
    it('should remove a key', function () {
      sqz.tasks.config.remove('testSetting');
      expect(sqz.tasks.config.get('testSetting')).to.not.equal('hello');
    });
  });
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Settings = require('../../common/settings');

/**
 * Class which builds an Object for returning local version information  .
 * @name sqz.tasks.version
 */

var Version = function () {
  function Version(sqz) {
    _classCallCheck(this, Version);

    this.sqz = sqz;

    var settings = new Settings();

    this.versionData = {
      squeezerCliVersion: 'v' + settings.get().version,
      nodeVersion: process.version,
      osPlatform: process.platform
    };
  }

  /**
   * Return current version information
   * @returns {Object}
   * @example
   *
   * sqz.tasks.version.get()
   *
   * Returns :
   *
   * {
   *    squeezerCliVersion: 'v1.1.0',
   *    nodeVersion: 'v6.4.0',
   *    osPlatform: 'darwin'
   * }
   */


  _createClass(Version, [{
    key: 'get',
    value: function get() {
      return this.versionData;
    }

    /**
     * Return markdown formatted version message
     * @returns {Object}
     * @example
     *
     * sqz.tasks.version.msg()
     *
     * Returns :
     *
     * * Squeezer CLI version: v1.1.0
     * * Node version: v6.4.0
     * * OS platform: darwin
     */

  }, {
    key: 'msg',
    value: function msg() {
      var spacer = ' '.repeat(3);

      var msg = spacer + '* Squeezer CLI version: ' + this.versionData.squeezerCliVersion + '\n' + (spacer + '* Node version: ' + this.versionData.nodeVersion + '\n') + (spacer + '* OS platform: ' + this.versionData.osPlatform);

      return msg;
    }
  }]);

  return Version;
}();

module.exports = Version;
'use strict';

var expect = require('chai').expect;

module.exports = function (sqz) {
  describe('sqz.common.version.get()', function () {
    it('should be an object', function () {
      expect(sqz.tasks.version.get()).to.be.an('object');
    });

    it('should contain some keys', function () {
      expect(sqz.tasks.version.get()).to.have.property('squeezerCliVersion').that.is.a('string').to.have.length.of.at.least(2);

      expect(sqz.tasks.version.get()).to.have.property('nodeVersion').that.is.a('string').to.have.length.of.at.least(2);

      expect(sqz.tasks.version.get()).to.have.property('osPlatform').that.is.a('string').to.have.length.of.at.least(2);
    });
  });
};
