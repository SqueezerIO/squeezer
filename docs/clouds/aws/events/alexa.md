### Alexa Skills events

#### Hook a Lambda function for the Alexa Skills events

`sqz.config.yml` :

```yaml
functions:
  testFunction:
    handler: "test"
    events:
      - alexaSkills: true
```

`handler.js` :

```js
exports.test = (event, context) => {
  console.log(JSON.stringify(event, null, 2))
  context.succeed(event);
};
```
