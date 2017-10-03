---
title: AWS - Events - IoT
---

#### Hook a Lambda function for the IoT events

`sqzueezer.yml` :

```yaml
events:
  - type: iot
    sql: "SELECT * FROM 'some_topic'"
```

`handler.js` :

```js
exports.handler = (event, context) => {
  console.log(JSON.stringify(event, null, 2))
  context.succeed(event);
};
```
