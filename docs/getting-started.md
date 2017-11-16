---
title: Introduction - Get started
---
### Install Squeezer's command line tool

`npm install squeezer-cli -g`

### Using the CLI

1. Create a new project . `sqz create --project my-first-project --template api-nodejs`
2. `cd my-first-project`
3. `sqz install` - Install all project's packages ( npm ... )
4. `sqz compile` - Compile functions , sources , ...
5. `sqz serve` - Will start a live-reloading development environment accessible at `localhost:4001`  ( **Live compiling** )

### Deploy a project

Configure provider & setup credentials

1. `sqz install` - Install packages
2. `sqz compile --cloud --stage dev` - Compile functions , sources , ... ( cloud ready )
3. `sqz deploy` - Deploys project into the cloud