### Schedule Events ( Cron ) 

#### Cron Expressions

You can create rules that self-trigger on schedule in CloudWatch Events using Cron or rate expressions. 
All scheduled events use UTC time zone and the minimum precision for schedules is 1 minute.

[CRON Expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression)

#### Rate Expressions

Rate Expressions

A rate expression starts when you create the scheduled event rule, and then runs on its defined schedule.

Rate expressions have two required fields. Fields are separated by white space.

**Syntax**

rate(value unit)

`value` - A positive number.

`unit`  - The unit of time.

Valid values: **minute** | **minutes** | **hour** | **hours** | **day** | **days**

`sqz.config.yml` :

```yaml
functions:
  scheduleFunc:
    description: "Schedule Event"
    handler: "scheduleTask"
    events:
      - schedule: true
        value: rate(1 minute)
      # OR
      - schedule: 
        value: cron(0 10 * * * *)
```

`handler.js`

```javascript
exports.scheduleTask = (event, context) => { 
  context.succeed(event);
};
```

`$ sqz deploy`

`Schedule Event output:` 

`$ sqz logs --function scheduleFunc`

```json
{
  "version": "0",
  "id": "5f128951-c739-4e6c-b192-364e5b9c51cb",
  "detail-type": "Scheduled Event",
  "source": "aws.events",
  "account": "161498329478",
  "time": "2017-02-02T18:59:21Z",
  "region": "eu-central-1",
  "resources": [
    "arn:aws:events:eu-central-1:161498329478:rule/MyFirstProject-dev-ProductsStack-1-TestEventsRule1-UPZMS5DVU3FA"
  ],
  "detail": {}
}
```
