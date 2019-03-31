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

#### Deploy it from Platform

1. Login to the Platform https://platform.squeezer.io
2. Import project from github
3. Deploy it

#### Do it by your own

Configure provider & setup credentials

1. `sqz install` - Install packages
2. `sqz compile --cloud --stage dev` - Compile functions , sources , ... ( cloud ready )
3. `sqz deploy` - Deploys project into the cloud

<br/><br/>

## ChainKit - Agnostic blockchain integration

The main usage of the ChainKit is to unify top blockchains interfaces into a single normalized API interface , therefore you can build blockchain apps easily without digging into all blockchain infrastructures.


### [Learn how to use ChainKit](https://github.com/SqueezerIO/squeezer-chainkit)