### Microservice

Can be considered a derivation of service-oriented architectures (SOA) which run as a standalone software component and it's used to build distributed software systems .

*A `microservice` can contain one or more `functions` .*

### Cloud

A microservice cloud platform , like [AWS Lambda](https://aws.amazon.com/lambda/details/)

### Function

A microservice function handler, [example](http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html)  :

```
exports.myHandler = function(event, context, callback) {
   ...

   // Use callback() and return information to the caller.
}
```

### AWS Lambda

[Lambda](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html) it's the default Amazon Web Services microservices platform
which currently supports NodeJS, JAVA & Python .

### Cloud Formation

[AWS CloudFormation](https://aws.amazon.com/cloudformation/) gives developers and systems administrators an easy way to create and manage a
collection of related AWS resources, provisioning and updating them in an orderly and predictable fashion.
The concept it's really simple , you create a JSON template where you add the resources.

Follow this trivial Wordpress example cloudformation template 
[example](https://s3-ap-southeast-2.amazonaws.com/cloudformation-templates-ap-southeast-2/WordPress_Single_Instance.template)

Squeezer it's using CloudFormation engine in order to deploy his project artifacts.

### Project

A Squeezer project includes one or more microservices. 
