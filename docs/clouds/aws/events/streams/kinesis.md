### Kinesis streams

#### Add a new Kinesis stream resource

`PROJECT_DIR/cloudformation/kinesis-template.yml` :

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: Kinesis Stack
Resources:
  myKinesisStream:
    Type: "AWS::Kinesis::Stream"
    Properties:
      ShardCount: 1
Outputs:
  myKinesisStreamArn:
    Value:
      Fn::GetAtt:
        - myKinesisStream
        - Arn
```

Include the `kinesis-template.yml` file in the main stack.

`PROJECT_DIR/cloudformation/main-template.yml` :

```yaml
Resources:
  dynamoStack:
    Type: "AWS::CloudFormation::Stack"
    Properties:
      TemplateURL: kinesis-template.yml
      TimeoutInMinutes: 10
```

#### Hook a Lambda function to the stream event

`sqz.config.yml` :

```yaml
functions:
  testFunction:
    handler: "test"
    events:
      - stream: true
        sourceArn: KinesisStack.Outputs.myKinesisStreamArn
        batchSize: 100
        startPosition: LATEST
```

`handler.js` :

```js
exports.test = (event, context) => {
  console.log(JSON.stringify(event, null, 2))
  context.succeed(event);
};
```

`$ sqz deploy`

Insert a new record in the newly created Kinesis stream ( you need your Kinesis stream name )

`$ aws cloudformation describe-stacks`

Grab the `OutputValue` as the stream name for the OutputKey `myKinesisStreamName`

`$ aws kinesis put-record --stream-name "myKinesisStreamName" --partition-key 123 --data testdata `

`$ sqz logs --function testFunction`

Log's output should be something like this :

```json
{
  "Records": [
    {
      "kinesis": {
        "kinesisSchemaVersion": "1.0",
        "partitionKey": "123",
        "sequenceNumber": "49570151662850012609182461443072759844919241340945956866",
        "data": "dGVzdGRhdGE=",
        "approximateArrivalTimestamp": 1486202022.587
      },
      "eventSource": "aws:kinesis",
      "eventVersion": "1.0",
      "eventID": "shardId-000000000000:49570151662850012609182461443072759844919241340945956866",
      "eventName": "aws:kinesis:record",
      "invokeIdentityArn": "arn:aws:iam::xxxxx:role/MyFirstProject-dev-iamStack-IamRoleLambdaExecution-xxxxxxx",
      "awsRegion": "eu-central-1",
      "eventSourceARN": "arn:aws:kinesis:eu-central-1:xxxxxxx:stream/MyFirstProject-dev-KinesisStack-xxxxxx-myKinesisStream-xxxxxx"
    }
  ]
}
```
