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

### Project

A Squeezer project includes one or more microservices. 
