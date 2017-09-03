### HTTP trigger

The HTTP trigger will execute your function in response to an HTTP request. 
You can customize it to respond to a particular URL or set of HTTP methods. An HTTP trigger can also be configured to respond to webhooks.

Find more details at https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook

`squeezer.yml`

```yaml
functions:
  hello:
    description: Says hello
    handler: hello
    events:
      - http: true
        path: /example/hello
        method: get
        x-azure-settings:
          name: req # HTTP request object
          authLevel: anonymous # anonymous | function | admin

```

`handler.js`

```javascript
'use strict';

exports.hello = (context, req) => {
  const query   = req.query;    // query strings
  const body    = req.body;     // parsed content-type body
  const method  = req.method;   // HTTP Method
  const headers = req.headers;  // HTTP headers
  const params  = req.params;   // URL params /example/{param}
  const rawBody = req.rawBody;  // unparsed body

  context.res = {
      headers:{
        'content-type':'application/json'
      },
      body: {
        text  : 'Hello World !!!',
        req : req
      }
  }
  context.done();
};
```

#### CORS

Integrated on the `PROJECT_DIR/armTemplates/azuredeploy.json`
