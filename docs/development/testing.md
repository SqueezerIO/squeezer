---
title: Development - Testing
---

### Add tests to a function

`FUNCTION/squeezer.yml` :

```yaml
tests:
  - src/db.test.js
  - src/api.test.js
  - src/web.test.js
```

## Run tests
`$ sqz test` 

## Run smart tests

It will run tests against new or changed functions only .

**NOTE**: This feature requires a deployment key

`$ sqz test --smart` 

**NOTE**: Is recommended to run tests before deploying resources to the cloud
