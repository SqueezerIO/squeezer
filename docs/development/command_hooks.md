### Command Hooks

Squeezer offers your the ability to control your project's commands actions like testing, running , deploying
directly from your project's directory stored in `PROJECT_DIR/lib/hooks/commands` . This feature effort stands for
separating your project functionality as much as possible, and use Squeezer framework only as a trigger .

```
PROJECT_DIR/lib/hooks/
└── commands
    ├── compile
    │   ├── development
    │   │   └── microservice.yml  - compile microservices for local development
    │   └── production
    │       └── microservice.yml  - compile microservices for cloud deployments 
    ├── install
    │   ├── microservice.yml      - install packages required for each microservice
    │   └── project.yml           - install project required packages
    ├── run
    │   └── execute.function.yml  - run a function locally
    ├── test
    │   └── execute.yml           - run integration tests for a microservice
    └── update
        ├── microservice.yml      - update packages for each microservice
        └── project.yml           - update project packages
```
