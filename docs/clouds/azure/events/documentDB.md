### DocumentDB Trigger
       
The DocumentDB API input binding retrieves a Cosmos DB document and passes it to the named input parameter of the function. The document ID can be determined based on the trigger that invokes the function.

https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-documentdb

```yaml
functions:
  example:
    handler: hello
    events:
      - documentDB: true
        x-azure-settings:
          name: record # Name of input parameter in function signature>
          databaseName: myDocs # Name of the DocumentDB database
          collectionName: todo # Name of the DocumentDB collection
          createIfNotExists: true
          connection: docDBAppSetting # Name of app setting with connection string
          direction: out
```

```javascript
'use strict';

exports.hello = (context, event) => {
  context.log(`Got event: ${event}`);
  context.done();
};
```
