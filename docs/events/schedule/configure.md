---
title: Events - Schedule - Configure
---

#### Executes a function at a specific time interval

`FUNCTION/squeezer.yml` :

```yaml
event:
  type: schedule
  cron: * * * * * *
```

| Minutes |  Hours |  Day of month | Month | Day of week | Year | Description |
|---|---|---|---|---|---|---|
| 0 | 10 | * | * | ? | * | Run at 10:00 am (UTC) every day |
| 15 | 12 | * | * | ? | * |  Run at 12:15 pm (UTC) every day |
| 0 | 18 | ? | * | ? | * | Run at 6:00 pm (UTC) every Monday through Friday |