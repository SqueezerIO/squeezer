---
title: AWS - Events - Dynamo DB streams
---

## Add a new DynamoDB table resource

`PROJECT_DIR/cloudformation/dynamo-template.yml` :

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: Dynamo Stack
Resources:
  ProductsDynamo:
    Type: "AWS::DynamoDB::Table"
    DeletionPolicy: Retain
    Properties:
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      ProvisionedThroughput:
        ReadCapacityUnits: 1
        WriteCapacityUnits: 1
      StreamSpecification:
        StreamViewType: NEW_AND_OLD_IMAGES
Outputs:
  ProductsDynamoTable:
    Value:
      Ref: ProductsDynamo
  ProductsDynamoTableStreamArn:
    Value:
      Fn::GetAtt:
        - ProductsDynamo
        - StreamArn
```

Include the `dynamo-template.yml` file in the main stack.

`PROJECT_DIR/cloudformation/main-template.yml` :

```yaml
Resources:
  dynamoStack:
    Type: "AWS::CloudFormation::Stack"
    Properties:
      TemplateURL: dynamo-template.yml
      TimeoutInMinutes: 10
```

## Hook a Lambda function to the stream event

`squeezer.yml` :

```yaml
events:
  - type: stream
    sourceArn: DynamoStack.Outputs.ProductsDynamoTableStreamArn
    batchSize: 100
    startPosition: LATEST
```

`handler.js` :

```js
exports.handler = (event, context) => {
  console.log(JSON.stringify(event, null, 2))
  context.succeed(event);
};
```

`$ sqz deploy`

Insert a new item in the newly created `Products` table

`$ sqz logs --function testFunction`

Log's output should be something like this :

```json
{
  "Records": [
    {
      "eventID": "84cf2aa10e82297833bb65ef5bcc3347",
      "eventName": "INSERT",
      "eventVersion": "1.1",
      "eventSource": "aws:dynamodb",
      "awsRegion": "eu-central-1",
      "dynamodb": {
        "ApproximateCreationDateTime": 1486128060,
        "Keys": {
          "id": {
            "S": "6e83b8c9-37ef-4120-9a64-b942dff81556"
          }
        },
        "NewImage": {
          "createdAt": {
            "N": "1486128092421"
          },
          "price": {
            "N": "0"
          },
          "id": {
            "S": "6e83b8c9-37ef-4120-9a64-b942dff81556"
          },
          "category": {
            "S": "string"
          },
          "title": {
            "S": "string"
          },
          "updatedAt": {
            "N": "1486128092421"
          }
        },
        "SequenceNumber": "12955800000000000697150425",
        "SizeBytes": 141,
        "StreamViewType": "NEW_AND_OLD_IMAGES"
      },
      "eventSourceARN": "arn:aws:dynamodb:eu-central-1:xxxxx:table/MyFirstProject-dev-DynamoStack-1T3HNHMKJKPJB-ProductsDynamo-bbbb/stream/2017-02-03T13:18:58.738"
    }
  ]
}

```
