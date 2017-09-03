### IoT events

#### Hook a Lambda function for the IoT events

`sqz.config.yml` :

```yaml
functions:
  testFunction:
    handler: "test"
    events:
      - iot: true
        sql: "SELECT * FROM 'some_topic'"
```

`handler.js` :

```js
exports.test = (event, context) => {
  console.log(JSON.stringify(event, null, 2))
  context.succeed(event);
};
```
