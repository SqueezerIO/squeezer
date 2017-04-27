### Swagger

Squeezer supports [Swagger API docs](http://swagger.io) integration in the microservices directories :

```
PROJECT_DIR
.
microservices/
└── hello
    ├── handler.js
    ├── sqz.cloudformation.yml
    ├── sqz.config.yml
    └── sqz.swagger.yml
```

`sqz.swagger.yml` :

```yaml
paths:
  /pet:
    post:
      tags:
        - "pet"
      summary: "Add a new pet to the store"
      description: "long description"
      operationId: "addPet"
      consumes:
        - "application/json"
        - "application/xml"
      produces:
        - "application/xml"
        - "application/json"
definitions:
  Pet:
    type: "object"
    required:
      - "name"
      - "photoUrls"
    properties:
      id:
        type: "integer"
        format: "int64"
```
