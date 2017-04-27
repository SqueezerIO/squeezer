### API Project

Squeezer frameworks supports EVENT-DRIVEN APIs projects .

Additionally you have support for tools like  **Swagger** & **GraphQL** .

## Web Project

### Structure

```
PROJECT_DIR
├── cloudformation              - CloudFormation templates
├── lib
│   ├── bin
│   ├── hooks                   - command hooks from where you can control the framework behaviour
│   │   └── commands   
│   ├── http                    - http return formatting
│   ├── utils                   - common utils for your project
│   └── webpack                 - webpack configuration directory
│       └── plugins
├── microservices
│   └── hello
│       └── src
│           ├── lib
│           └── tests
│               ├── integration - integration tests
│               └── unit        - unit tests
├── plugins
└── templates                   - PUG main templates
```
