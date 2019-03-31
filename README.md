<a href="https://squeezer.io" target="_blank"><img width="700" height="auto" src="./readme-introduction.gif"></a>

#### Framework : [squeezer.io](https://squeezer.io)
#### Docs : [docs.squeezer.io](https://docs.squeezer.io/)
#### Chat : [chat.squeezer.io](http://chat.squeezer.io)

[![Squeezer.IO](https://cdn.rawgit.com/SqueezerIO/squeezer/9a010c35/docs/gitbook/images/badge.svg)](https://Squeezer.IO)
[![Build Status](https://travis-ci.org/SqueezerIO/squeezer.svg?branch=master)](https://travis-ci.org/SqueezerIO/squeezer)
[![npm version](https://badge.fury.io/js/squeezer-cli.svg)](https://badge.fury.io/js/squeezer-cli)
[![Join the chat at https://gitter.im/SqueezerIO/squeezer](https://badges.gitter.im/SqueezerIO/squeezer.svg)](https://gitter.im/SqueezerIO/squeezer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![DUB](https://img.shields.io/dub/l/vibe-d.svg)]()

### Contents

* [Getting Started](#getting-started)
* [Example Projects](#example-projects)
* [Features](#features)
* [Templates](#templates)
* [Plugins](#plugins)
* [Example Projects](#example-projects)
* [Contributing](#contributing)
* [Community](#community)
* [Meetups](#meetups)

### What is Squeezer ?

Squeezer is a framework designed to help  developers to get a better architecture on serverless
zero-administration compute platforms where code runs on the top of
`functions` clouds like
[AWS Lambda](https://aws.amazon.com/documentation/lambda/) , [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) , [IBM OpenWhisk](https://developer.ibm.com/openwhisk/) & [Google Functions](https://cloud.google.com/functions/)

### Blockchain Connector

Agnostic blockchain connector

The main scope of the connector is to unify all the current blockchains data assets into a single normalized API interface , therefore you can build blockchain apps easily without digging into all blockchain infrastructure & genesis. The quickest integration to send or receive blockchain transactions and trigger smart contracts private/public methods.

[How to use](https://github.com/SqueezerIO/squeezer-blockchain-connector) the blockchain connector

### <a name="features"></a>Features in short

- [Swagger UI](http://swagger.io/) API REST  documentation support
- **SEO-friendly** web apps
- share components between functions
- auto-deployable, auto-scalable , no DevOps requirements
- silent deployments ,no interruption for the current functionality ( really useful on production )
- access deployed resources credentials (DB user, pass ...) directly from `process.env` variables  
- one single command to simultaneously deploy all available functions on your project
- quick intuitive code deployments by using a special mechanism which will deploy only assets, functions and file packages
where code changed from the last deployment
- automatic rollback to the previous working deployment if something goes wrong
- sequential deployments, wait for the current deployments in progress to finish
- self-healing functions
- test your code locally on a simulated functions platform for a faster development cycle
- separate your environments in multiple stages
- extend framework functionality with your own "home-made" plugins
- pay only for the usage ( no monthly subscriptions )
- competitive pricing (  >= 2$ / 1 million HTTP requests )
- smart external dependencies inclusion into the compiled function ( **node_modules** and other project files ) ... just
like on any other trivial NodeJS project
- Webpack integration

#### Requirements

- [Install node.js](http://nodejs.org/) version `>=6`

### Squeezer CLI

> Squeezer command-line interface

#### <a name="templates"></a>Templates

Create a quick project stub by using templates :

| template | description |
|-----|--------------|
|api-nodejs | AWS generic API app template. |

#### <a name="plugins"></a>Plugins

Extend or merge the Squeezer framework functionality with plugins

| Plugin | Author |
|-----|--------------|
|**[Serve Plugin](https://github.com/SqueezerIO/squeezer-serve)** <br/> This plugin enables serving support for local development within the Squeezer Framework. | [Nick Chisiu](https://github.com/nickchisiu) |
|**[Swagger Plugin](https://github.com/SqueezerIO/squeezer-swagger)** <br/> This plugin enables Swagger API Documentation support within the Squeezer Framework. | [Nick Chisiu](https://github.com/nickchisiu) |

#### <a name="example-projects"></a>Example Projects

| Project Name | Author | Demo |
|-------------|------|---------|
| **[Generic API](https://github.com/SqueezerIO/example-projects/tree/master/api-nodejs)** <br/>  Generic API Hello World + Swagger API Docs | [Nick Chisiu](https://github.com/nickchisiu) | [demo]() |
| **[REST API](https://github.com/SqueezerIO/example-projects/tree/master/api-rest-nodejs)** <br/>  REST API using MongoDB + Swagger API Docs | [Nick Chisiu](https://github.com/nickchisiu) | [demo]() |


#### <a name="getting-started"></a>Getting started

NOTE: **Windows** users should [enable symlinks](http://answers.perforce.com/articles/KB/3472/?q=enabling&l=en_US&fs=Search&pn=1) in order to avoid unwanted symbolic links errors .

##### Serve

|    | cmd | description  |
|----|-----|--------------|
| 1. | **npm i squeezer-cli -g**  |  Install Squeezer CLI |
| 2. | **sqz create --project my-first-project --template api-nodejs**  |  Create a project |
| 3. | **cd my-first-project**  |  Switch to the project's directory |
| 4. | **sqz install**  |  Install dependencies |
| 4. | **sqz compile**  |  Compile functions |
| 5. | **sqz serve**  |  Development mode<br>**Live compiling** |

##### Deploy

|    | cmd | description  |
|----|-----|--------------|
| 1. | Configure provider & setup credentials  |   |
| 2. | **sqz compile --cloud --stage dev**  |  Compile functions for cloud deployments |
| 3. | **sqz deploy**  | Deploy your app into the cloud provider |


#### <a name="contributing"></a>Contributing

See [contributing.md](CONTRIBUTING.md) for contribution guidelines

### <a name="community"></a>Community

* [Squeezer issues](https://github.com/SqueezerIO/squeezer/issues)
* [Gitter Chatroom](http://chat.squeezer.io/)
* [Facebook](https://www.facebook.com/Squeezer.IO/)
* [Twitter](https://twitter.com/SqueezerIO)
* [Contact Us](mailto:nick@squeezer.io)

### <a name="meetups"></a>Meetups

* [Workshop: Serverless javascript with Squeezer](https://www.meetup.com/Cluj-Javascripters/events/243915438/?)
