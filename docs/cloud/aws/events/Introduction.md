---
title: AWS - Events
---

[Lambda Events Sources](http://docs.aws.amazon.com/lambda/latest/dg/invoking-lambda-function.html)

#### Prepare a mocked input event

In order to speed-up the development cycle you can easily get a mocked event input .

```
function/
├── event.input.json
├── handler.js
├── squeezer.yml
```

[Sample Events](http://docs.aws.amazon.com/lambda/latest/dg/eventsources.html)

**Amazon SNS Sample Event**

`event.input.json`

```json
{
  "Records": [
    {
      "EventVersion": "1.0",
      "EventSubscriptionArn": "eventsubscriptionarn",
      "EventSource": "aws:sns",
      "Sns": {
        "SignatureVersion": "1",
        "Timestamp": "1970-01-01T00:00:00.000Z",
        "Signature": "EXAMPLE",
        "SigningCertUrl": "EXAMPLE",
        "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        "Message": "Hello from SNS!",
        "MessageAttributes": {
          "Test": {
            "Type": "String",
            "Value": "TestString"
          },
          "TestBinary": {
            "Type": "Binary",
            "Value": "TestBinary"
          }
        },
        "Type": "Notification",
        "UnsubscribeUrl": "EXAMPLE",
        "TopicArn": "topicarn",
        "Subject": "TestInvoke"
      }
    }
  ]
}
```
