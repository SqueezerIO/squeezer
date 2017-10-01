---
title: AWS - Events - Alexa Skills
---

## Hook a Lambda function for the Alexa Skills events

`sqzueezer.yml` :

```yaml
events:
  - type: alexaSkills
```

`handler.js` :

```js
exports.handler = (event, context) => {
  console.log(JSON.stringify(event, null, 2))
  context.succeed(event);
};
```
