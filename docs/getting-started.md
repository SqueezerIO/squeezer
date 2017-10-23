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
5. `sqz serve` - Will start a live-reloading development environment accessible at `localhost:4001`

### Deploy a project

[Configure credentials](https://docs.squeezer.io/clouds/aws/credentials.html)

1. `sqz install` - Install packages
1. `sqz compile --cloud --stage dev` - Compile functions , sources , ... ( cloud ready )
2. `sqz deploy` - Deploys project into the cloud