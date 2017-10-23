---
title: Plugin - Example
---

https://github.com/SqueezerIO/my-first-plugin

All plugins are automatically loaded from your project root directory `PROJECT_DIR/plugins/`

*Plugin file structure*

```
PROJECT_DIR
.
├── README.md
├── microservices
├── node_modules
├── package.json
├── plugins
    └── my-first-plugin
        ├── hooks.yml
        ├── index.js
        └── lib
            └── index.js
```

### Activate a Plugin

`PROJECT_DIR/squeezer.yml` :

```yaml
  plugins:
    - squeezer-plugin
```

### Common

You can use many of the Squeezer framework features in the [Common](common.md) section .

### Extends a current framework command ( *it will add `--msg` option for current `deploy` command* )

 
`index.js` :
 
```javascript
'use strict';

class MyFirstPlugin {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['deploy'],
        summary     : '',
        description : '',
        lifecycle   : [
          'before:project:validate',
          'after:project:validate',
          'deploy:final'
        ],
        options     : {
          msg : {
            title        : 'your text message',
            description  : 'this is a simple message description',
            value        : true, // true if this option can have a value
            required     : true, // option required
            defaultValue : null, // add a default value
            validate     : {
              fn    : (val) => (val.length <= 100),
              error : 'your message can\'t contain more than 100 characters'
            }
          }
        },
      }
    ];
  }
}

module.exports = MyFirstPlugin;
``` 

### Or add a fresh new command to the CLI ...

```javascript
'use strict';

class MyFirstPlugin {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['command' , 'subcommand'],
        summary     : 'my new fresh plugin',
        description : 'my long description ... long ... really long',
        lifecycle   : [
          'hello',
        ],
    ...   
```

```
$ sqz command:subcommand --debug
```

### Configure hooks

`hooks.yml` :

```yaml
- identifier : 'before:project:validate'
  path : 'lib'
  function : 'before'
- identifier : 'after:project:validate'
  path : 'lib'
  function : 'after'
- identifier : 'deploy:final'
  path : 'lib'
  function : 'final'
```

`lib/index.js` :

```javascript
'use strict';

/**
 * My first plugin hooks  .
 */
class MyFirstPluginHooks {
  constructor(sqz) {
    this.sqz = sqz;
    this.Promise = this.sqz.utils.bluebird();
    this.params = this.sqz.cli.params.get();
    this.colors = this.sqz.utils.colors();
  }

  before() {
    return new this.Promise((resolve) => {
      this.sqz.cli.log.info(`Showing message ${this.colors.blue(this.params.options.msg[0])}` +
        ` before the ${this.colors.blue('project:validate')} event!`);

      resolve();
    });
  }

  after() {
    return new this.Promise((resolve) => {
      this.sqz.cli.log.info(`Showing message ${this.colors.blue(this.params.options.msg[0])}` +
        ` after the ${this.colors.blue('project:validate')} event!`);

      resolve();
    });
  }

  final() {
    return new this.Promise((resolve) => {
      this.sqz.cli.log.info(`Showing message ${this.colors.blue(this.params.options.msg[0])}` +
        ` after the final of the deployment lifecycle !`);

      resolve();
    });
  }
}

module.exports = MyFirstPluginHooks;
```

### Execute

```
$ sqz deploy --msg "hello" --debug
```
