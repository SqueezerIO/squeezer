### Timer trigger

The timer trigger supports multi-instance scale-out. A single instance of a particular timer function is run across all instances.

Find more details on https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer

`squeezer.yml`

```yaml
functions:
  hello:
    description: Says hello
    handler: hello
    events:
      - timer: true
        x-azure-settings:
          name: item # Name of trigger parameter in function signature
          schedule: 0 */5 * * * * # cron expression
```

`handler.js`

```javascript
'use strict';

exports.hello = (context, timerObject) => {
  context.log('Timer triggered');
  context.done();
};
```
