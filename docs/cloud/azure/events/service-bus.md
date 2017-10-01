---
title: Microsoft Azure - Events - Service Bus Trigger
---
    
Use the Service Bus trigger to respond to messages from a Service Bus queue or topic.

https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus

`squeezer.yml`

```yaml
events:
  - type: serviceBus
    x-azure-settings:
      name: item # Name of input parameter in function signature
      queueName: hello # Name of the queue
      accessRights: manage # Access rights for the connection string - see below
      connection: ServiceBusConnection # serviceBusTrigger
```

```javascript
'use strict';

exports.handler = (context, event) => {
  context.log(`Got event: ${event}`);
  context.done();
};
```
