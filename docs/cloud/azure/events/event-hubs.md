---
title: Microsoft Azure - Events - Event Hubs Trigger
---
    
Use the Event Hubs trigger to respond to an event sent to an event hub event stream. You must have read access to the event hub to set up the trigger.

https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-hubs

`squeezer.yml`

```yaml
events:
  - type: eventHub
    x-azure-settings:
      name: item # Name of trigger parameter in function signature
      path: hello # Name of the event hub
      consumerGroup: $Default # Consumer group to use
      connection: EventHubsConnection #  must be the name of an app setting that contains the connection string to the event hub's namespace
```

```javascript
'use strict';

exports.handler = (context, event) => {
  context.log(`Got event: ${event}`);
  context.done();
};
```
