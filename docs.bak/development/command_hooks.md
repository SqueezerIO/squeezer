### Command Hooks

Squeezer offers your the ability to control your project's commands actions like testing, running , deploying
directly from your project's directory stored in `PROJECT_DIR/lib/hooks/commands` . This feature effort stands for
separating your project functionality as much as possible, and use Squeezer framework only as a trigger .

```
PROJECT_DIR/lib/hooks/commands/
├── deploy.compile.yml    - compiles source code before a cloud deployment
├── project.install.yml   - installs projects dependencies on project creation or project install command
├── run.compile.yml       - compiles source code before running a function
├── run.execute.yml       - executes your desired function
├── serve.execute.yml     - commands to run in order to serve/watch your project
├── test.compile.yml      - compiles source code before running tests
├── test.execute.yml      - executes tests
└── test.prepare.yml      - prepare your project before compiling tests
```
