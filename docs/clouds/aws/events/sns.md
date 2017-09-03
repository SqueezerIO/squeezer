### SNS events

#### Add a new SNS topic resource

`PROJECT_DIR/cloudformation/sns-template.yml` :

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: SNS Stack
Resources:
  mySNSTopic:
    Type: "AWS::SNS::Topic"
Outputs:
  mySNSTopicName:
    Value:
      Fn::GetAtt:
        - mySNSTopic
        - TopicName
  mySNSTopicNameArn:
    Value:
      Ref: mySNSTopic
```

Include the `sns-template.yml` file in the main stack.

`PROJECT_DIR/cloudformation/main-template.yml` :

```yaml
  snsStack:
    Type: "AWS::CloudFormation::Stack"
    Properties:
      TemplateURL: sns-template.yml
      TimeoutInMinutes: 10
```

#### Hook a Lambda function to the sns event

`sqz.config.yml` :

```yaml
functions:
  testFunction:
    handler: "test"
    events:
      - sns: true
        topic: snsStack.mySNSTopic
```

`handler.js` :

```js
exports.test = (event, context) => {
  console.log(JSON.stringify(event, null, 2))
  context.succeed(event);
};
```

`$ sqz deploy`

`$ aws cloudformation describe-stacks`

Grab the `OutputValue` as the stream name for the OutputKey `mySNSTopicNameArn`

`$ aws sns publish --topic-arn "mySNSTopicNameArn" --message hello`

`$ sqz logs --function testFunction`

Log's output should be something like this :

```json
{
  "Records": [
    {
      "EventSource": "aws:sns",
      "EventVersion": "1.0",
      "EventSubscriptionArn": "arn:aws:sns:eu-central-1:xxxx:MyFirstProject-dev-snsStack-xxxx-mySNSTopic-L06ROZHUCL0T:ec873118-6fe6-4c7d-bf97-6ed546bd5340",
      "Sns": {
        "Type": "Notification",
        "MessageId": "afe2bb5e-f7ea-5a11-a820-ea4ef30f18b5",
        "TopicArn": "arn:aws:sns:eu-central-1:161498329478:MyFirstProject-dev-snsStack-P9UL1YY2YIP3-mySNSTopic-L06ROZHUCL0T",
        "Subject": null,
        "Message": "hello",
        "Timestamp": "2017-02-04T16:34:45.447Z",
        "SignatureVersion": "1",
        "Signature": "xx543543dx/Kwt9qgE6dbBAOdNswAmT4925HWPzkivu4tpWp4CQGbzVC9nobJoqaxSPkKXJRSZBuez45Gr1zk23HpcKIMDJRvY9Rgz3eRLR8Bt4jvGEdesVNzI4g0ENHcjWHV9/IOiwMpLOB6xPqEPZ5b/fXwH75qxMhjsN2DreOyo/uD7hddDtoPhZKBfWqeIkNaoQqIaCQmKKIyAMigYoW0oE7RwfklXvpCBD4SUsl5+nRs3ZqhD20WE5z0O5AzME3T6zSnBAjLx+g6sVRHtTJcILVDglMUZ1g/rIvME4ZEjyHw==",
        "SigningCertUrl": "https://sns.eu-central-1.amazonaws.com/SimpleNotificationService-xxxxxx.pem",
        "UnsubscribeUrl": "https://sns.eu-central-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-central-1:161498329478:MyFirstProject-dev-snsStack-xxxxx-mySNSTopic-L06ROZHUCL0T:ec873118-6fe6-4c7d-bf97-6ed546bd5340",
        "MessageAttributes": {}
      }
    }
  ]
}
```
