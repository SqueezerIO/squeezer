### Queue Storage Trigger
    
The Azure Queue storage trigger enables you to monitor a queue storage for new messages and react to them.

Find more details on https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-queue

```yaml
functions:
  example:
    handler: hello
    events:
      - queue: true
        x-azure-settings:
          name: item # The name used to identify the trigger data in your code
          connection: AzureWebJobsStorage # connection property must contain the name of an app setting that contains a storage connection string. 
```

```javascript
'use strict';

exports.hello = (context, timerObject) => {
  context.log("Timer triggered");
  context.done();
};
```
