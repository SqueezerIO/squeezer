![Squeezer Intro](docs/gitbook/images/introduction.png)

## Framework : [squeezer.io](http://squeezer.io)
## Documentation : [docs.squeezer.io](http://docs.squeezer.io)

## What is Squeezer ?

Squeezer is a framework designed to help  developers to get a better architecture on serverless
zero-administration compute platforms where code runs on the top of
[microservices](https://en.wikipedia.org/wiki/Microservices) clouds like
[AWS Lambda](https://aws.amazon.com/documentation/lambda/) , [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) , [IBM OpenWhisk](https://developer.ibm.com/openwhisk/) & [Google Functions](https://cloud.google.com/functions/)

## Features in short

- [Swagger UI](http://swagger.io/) API REST  support
- **SEO-friendly** web apps with the [PUG](https://pugjs.org/) support ( formerly known as **JADE** ) + your favorite JS framework + CDN integrated support for project's assets (js, images, css, ...)
- share components between microservices
- auto-deployable, auto-scalable , no DevOps requirements
- [CloudFormation](https://aws.amazon.com/cloudformation/) deployments , silent, 
no interruption for the current functionality ( really useful on production )
- [CloudDormation Nested Stacks](https://aws.amazon.com/blogs/devops/use-nested-stacks-to-create-reusable-templates-and-support-role-specialization/)
  support & use templates [Outputs](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html) values directly as `process.env` variables  
- one single command to simultaneously deploy all available microservices on your project
- quick intuitive code deployments by using a special mechanism which will deploy only assets, functions and file packages
where code changed from the last deployment
- automatic rollback to the previous working deployment if something goes wrong
- sequential deployments, wait for the current deployments in progress to finish
- each microservice is called on demand separately, when the runtime is done , it exits , no need to worry about all
services loaded in a single NodeJS server that may cause RSS memory issues or V8 engine loop blockers
- test your code locally on a simulated microservices platform for a faster development cycle
- separate your environments in multiple stages
- extend framework functionality with your own "home-made" plugins
- pay only for the usage ( no monthly subscriptions )
- competitive pricing (  >= 2$ / 1 million HTTP requests on AWS API Gateway + Lambda )
- smart external dependencies inclusion into the compiled microservice ( **node_modules** and other project files ) ... just
like on any other trivial NodeJS project
- Babel ES6/ES7 + Webpack 2 integration

### Requirements

- [Install node.js](http://nodejs.org/) version `>=6`

## Squeezer CLI

> Squeezer command-line interface

### Templates

You can get various templates for creating a quick project stub :

| template | description  |
|-----|--------------|
|aws-api-nodejs|AWS generic API Hello World template
|aws-api-nodejs-rest|AWS NodeJS REST API template + DynamoDB + Swagger support
|aws-web-nodejs-reactjs|AWS NodeJS WebApp template + Pug ( ex-Jade ) + ReactJS support + Material UI + Bootstrap 3 styling


### Getting started

NOTE: **Windows** users should [enable symlinks](http://answers.perforce.com/articles/KB/3472/?q=enabling&l=en_US&fs=Search&pn=1) in order to avoid unwanted symbolic links errors .

#### Run

|    | cmd | description  |
|----|-----|--------------|
| 1. | **npm install -g squeezer-cli**  |  Install Squeezer CLI |
| 2. | [Configure AWS profile](https://docs.squeezer.io/clouds/aws/aws_profile.html)  |  AWS Profile |
| 3. | **sqz create --project my-first-project --template aws-api-nodejs --email you@example.org**  |  Create a project |
| 4. | **cd my-first-project**  |  Switch to the project's directory |
| 5. | **sqz install**  |  Install all requirements |
| 5. | **sqz compile**  |  Compile microservices |
| 7. | **sqz serve**  |  Simulates project on your local microservices platform<br>*NOTE* : Live reload enabled by default |


`WebApp` : [http://localhost:4001/](http://localhost:4001/)

`Swagger UI` : [http://localhost:4001/swagger-ui](http://localhost:4001/swagger-ui)


#### Deploy

|    | cmd | description  |
|----|-----|--------------|
| 1. | **sqz compile --production**  |  Compile microservices |
| 2. | **sqz deploy**  | Deploy your app into the cloud provider<br>*Note*: initial deployments can take longer <= **40 mins** |


### Project Structure

```
.
├── cloudformation      CloudFormation nested custom YAML templates
├── lib                 Project's Library
├── microservices       Microservices Directory
│   └── microservice1
│   └── microservice2
├── node_modules        Node NPM packages
└── plugins             Project's plugins
```
