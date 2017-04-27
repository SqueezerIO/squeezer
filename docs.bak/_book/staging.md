Squeezer can use multiple stages to deploy your microservices, nothing new on that , just a trivial feature.

But there is another tricky method to separate your resources to different , like for example,
you don't want like a lambda schedule event ( which is a similar crontab task ) to run on your 
development production , so you can specify only your preferred stages for a specific section , if you don't specify any stages
your resource will be available trough all the stages

```yaml
# SQUEEZER MICROSERVICE

identifier: x893x90c # DO NOT CHANGE/REMOVE THIS

stages:
  - dev
  - prod

name: blog-example-graphql
description: Orchestrating a blog with the help of GraphQL

functions:
  Hello:
    identifier: hn902c42
    description: just a simple hello
    stages:
      - dev
      - prod
    handler: hello
    memory: 128MB
    events:  
      api:
        stages:
          - dev
          - prod
        path: /v1/blog/hello
    timeout: 6
```

Additionally you can see that you can add custom stages for any microseervice or function.

But that's not all , you can use custom stages for AWS CloudFormation resources too, a short scenario
will be that you add some virtual private cloud intranets into your project, and you will not be able to access
that from your development machine, that resource should be able only on the production stages .


```YAML
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  myVPC-<%= vars.stage %>:
    Type: AWS::EC2::VPC
    stages:
      - dev
      - prod
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsSupport: 'false'
      EnableDnsHostnames: 'false'
      InstanceTenancy: dedicated
      Tags:
      - Key: foo
        Value: bar
```
