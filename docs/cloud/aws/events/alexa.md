---
title: AWS - Events - Alexa Skills
---

## Hook a Lambda function for the Alexa Skills events

`sqz.config.yml` :

```yaml
functions:
  testFunction:
    handler: "test"
    events:
      - type: alexaSkills
```

`handler.js` :

```js
exports.test = (event, context) => {
  console.log(JSON.stringify(event, null, 2))
  context.succeed(event);
};
```
