## Framework : [squeezer.io](http://squeezer.io)
## Documentation : [docs.squeezer.io](http://docs.squeezer.io)

### Project Structure

```
.
├── cloudformation      CloudFormation nested custom YAML templates
├── lib                 Project's Library
├── microservices       Microservices Directory
│   └── microservice1
│   └── microservice2
├── node_modules        Node NPM packages
└── plugins             Squeezer plugins
```


### Requirements

- [Install node.js](http://nodejs.org/) version `>=6`

## Squeezer CLI

> Squeezer command-line interface

### Getting started

NOTE: **Windows** users should [enable symlinks](http://answers.perforce.com/articles/KB/3472/?q=enabling&l=en_US&fs=Search&pn=1)  order to avoid unwanted symbolic links errors .

#### Run

|    | cmd | description  |
|----|-----|--------------|
| 1. | **npm install -g squeezer-cli**  |  Install Squeezer CLI |
| 2. | [Configure AWS profile](md/clouds/aws/aws_profile.html)  |  AWS Profile |
| 3. | **sqz create --name my-first-project --template aws-api-rest-nodejs**  |  Create a project |
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
