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

- [Install node.js](http://nodejs.org/) version `>=4`

## Squeezer CLI

> Squeezer command-line interface

### Getting started


|    | cmd | description  |
|----|-----|--------------|
| 1. | **npm install -g squeezer-cli**  |  Install Squeezer CLI |
| 1. | **sqz install**  |  Install all project dependencies |
| 3. | **sqz deploy**  |  Initial deployment ( required before **serve** ) <br>*NOTE* : first deployment takes a little longer |
| 4. | **sqz serve**  |  Simulates project on your local microservices platform<br>*NOTE* : live reload enabled by default |

**Web App** : [http://localhost:4001/](http://localhost:4001/)
