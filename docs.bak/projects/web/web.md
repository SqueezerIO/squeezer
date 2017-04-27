## Web Project

### Structure

```
PROJECT_DIR

├── assets                      - Main assets directory 
│   ├── js                      - main JavaScript assets ( usually framework's libraries )
│   ├── sass                    - main SASS assets ( usually framework's styles )
│   └── static                  - main static ( logos, images sprites ... )
│       └── images
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
│           ├── assets
│           │   ├── js          - JavaScript assets
│           │   ├── sass        - SASS assets
│           │   └── static      - static assets
│           │       └── images
│           ├── lib
│           ├── templates       - PUG templates
│           └── tests
│               ├── integration - integration tests
│               └── unit        - unit tests
├── plugins
└── templates                   - PUG main templates
```
