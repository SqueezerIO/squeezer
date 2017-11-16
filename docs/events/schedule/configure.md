---
title: Events - Schedule - Configure
---

#### Executes a function at a specific time interval

`FUNCTION/squeezer.yml` :

```yaml
event:
  type: schedule
  rate: 1 minute
```

**value**
An integer.

**unit**
Time unit.

Time units: `minute | minutes | hour | hours | day | days`