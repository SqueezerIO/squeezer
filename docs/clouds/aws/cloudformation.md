#### CloudFormation

AWS CloudFormation gives developers and systems administrators an easy way to create and manage a 
collection of related AWS resources, provisioning and updating them in an orderly and predictable fashion.

You can use AWS CloudFormation’s [sample templates](https://aws.amazon.com/cloudformation/aws-cloudformation-templates/) or create your own templates to describe the AWS resources
, and any associated dependencies or runtime parameters, required to run your application. 

Squeezer Framework is configured to use [nested stacks](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html)
stored in `PROJECT_DIR/cloudformation` directory .

```
PROJECT_DIR/cloudformation/
├── dynamo-template.yml
└── main-template.yml
```

`main-template.yml`:

```yaml
#Parameters:
Resources:
 DynamoStack:
  Type: "AWS::CloudFormation::Stack"
  Properties:
   TemplateURL: "dynamo-template.yml"
   TimeoutInMinutes: 10
#Outputs:
```

In this case Squeezer will add a new nested stack `dynamo-template.yml` to the main compiled stack 
( this includes the core compiled stack with the API Gateway stack, IAM resources stack 
& microservices stacks located in the `.build/cloudformation` directory shortly after your first deployment  )

`dynamo-template.yml`:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
#Parameters:
Description: "Dynamo Stack"
Resources:
  ProductsDynamo:
    Type: "AWS::DynamoDB::Table"
    DeletionPolicy: "Retain"
    Properties:
      AttributeDefinitions:
        - AttributeName: "id"
          AttributeType: "S"
      KeySchema:
        - AttributeName: "id"
          KeyType: "HASH"
      ProvisionedThroughput:
        ReadCapacityUnits: 5
        WriteCapacityUnits: 5
Outputs:
  ProductsDynamoTable:
    Value:
      Ref: "ProductsDynamo"
```

This CloudFormation template will create a new DynamoDB table resource , but in order to access this table later you need to grab the
generated table name which will be a Logical ID , therefore you have the ability to include 
the output as a shell permanent `ENV` variable in your microservice's `sqz.config.yml` or `PROJECT_DIR/squeezer.yml` files : 

```yaml
env:
  PRODUCTS_TABLE: "DynamoStack.Outputs.ProductsDynamoTable"
```

Squeezer will handle all CloudFormation required dependencies, more specifically
 it will add a `DependOn : ['DynamoStack']` to the main stack, required by your microservice stack
  in order to use the new DynamoDB table resource.

Use the new variable in the Node.JS code base :

`process.env.PRODUCTS_TABLE`
