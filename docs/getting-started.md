---
title: Introduction - Get started
---

### Platform

#### Login and SSO

The Squeezer platform will support multiple code repositories integration and SSO third-party vendors.

<img src="https://squeezer.io/images/platform/login.png" />

#### Overview

The “overview” dashboard will display information about current deployments split into multiple stages; this way, a project’s team is in-sync for the entire development cycle.

<img src="https://squeezer.io/images/platform/overview.png" />

#### Deploys

This section will allow developers to get more detailed information about the deployment in progress. They can trigger retries on a specific deployment or clear the deployment cache in order to fix crashed builds.

<img src="https://squeezer.io/images/platform/deploys.png" />

#### Settings

The settings section will provide most of the required input fields to make the developer’s experience of the platform as straightforward and intuitive as possible.

<img src="https://squeezer.io/images/platform/settings.png" />

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

<br/>
<br/>

## Blockchain Connector

Agnostic blockchain connector

The main scope for adding the connector is to unify all the current blockchains data assets into a single normalized API interface , therefore you can build blockchain apps easily without digging into all blockchain  infrastructures 

Basically the connector is only a client for the Squeezer Blockchain Gateway where actually all the magic happens. 

Check the Squeezer Blockchain Gateway API Documentation:

[Squeezer Blockchain Gateway - Test](https://squeezerblockchaingatewa-squeezerdeploymentbucket-1rzodet1yc0k1.s3.amazonaws.com/swagger-ui/index.html)

[Squeezer Blockchain Gateway - Production (in development)]()

<a name="table" />

Table of contents
=================

* [Install](#install)
* [ITN ( Instant Transaction Notification )](#itn)
* [Initialize](#init)
* [Wallet types](#walletTypes)
* [Create Wallet](#createWallet)
* [Send transaction](#sendTransaction)
* [Transactions](#transactions)
* [Get balance](#getBalance)
* [Smart contract](#smartContract)

<a name="install" />

### Install

`npm install squeezer-blockchain-connector --save`

[back to top](#table)

<a name="init" />

### Initialize

You will need a Squeezer access key in order to use the blockchain connector. You can get one [here](https://squeezer.io/docs/development/deployment-key/)

```javascript
const BlockchainConnector = require('squeezer-blockchain-connector');
const blockchainConnector = new BlockchainConnector(options); 
```
- ``options`` ***required***
- ``options.accessKey`` - ***required*** Squeezer access key 
- ``options.environment`` - ***required*** use ``test`` for sandbox or ``live`` for production

<a name="itn" />

## ITN ( Instant Transaction Notification )
----
The ITN system will notify your server when you receive a transaction and when a transaction status changes. This is a quick and useful way to integrate blockchain transactions processing.

Please check the ``Squeezer Blockchain Gateway API Documentation``->``
Configure ITN callback url``

ITN JSON object:

```JSON
{
  "from": "0xc03f7B9bddF8aeeBCbA2f818E5f873f71b85EB5c",
  "to": "0x903f7B9bddF8aeeBCbA2f818E5f873f71b85EB5c",
  "amount": "0.99999999",
  "type": "in",
  "accessKeyHash": "accessKeyHash",
  "hash": "0xcf387e8d1a95bd3a5b54269aa0a228...",
  "block": "891093",
  "status": 1,
  "itnStatus": 1,
  "createdAt": "2018-05-13 18:09:18",
  "updateAt": "2018-05-13 18:09:18"
}
```

NOTE: As a security measure please make sure that you validate `accessKeyHash` is the same at with your default `access key`

Validate `accessKeyHash` example:

```javascript
if (accessKeyHash === crypto.createHmac('SHA256', accessKey).update(accessKey).digest('base64')) {
  console.log('valid access key hash') 
} else {
  console.log('invalid access key hash')
}
```

[back to top](#table)

<a name="walletTypes" />

## Wallet types

Get current available blockchain wallet types

```javascript
blockchainConnector.walletTypes(callback)
```
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
blockchainConnector.walletTypes((err, response) => {
  console.log(response)
});
```

Example response from server
```json
{
  "message":"success",
  "data":[
    {
      "type":"ETH",
      "info":"Ethereum wallet."
    },
    {
      "type":"BTC",
      "info":"Bitcoin wallet."
    }
  ]
}
```

[back to top](#table)

<a name="createWallet" />

## Create wallet

Create a new blockchain wallet.

```javascript
blockchainConnector.createWallet(options, callback)
```
- ``options`` - ***required***.
- ``options.type`` - ***required***. Wallet type (``ETH``).
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
blockchainConnector.createWallet({
  type: 'ETH'
}, (err, response) => {
  console.log(response)
});
```

Example response from server
```json
{
  "walletID": "8193d025-6430-496e-abf3-88f06b51889c",
  "address": "0xbd61ef790C3eaf4D0c4D4bE3558F8a501863525f",
  "token": "41dbecfb0454183a4c7a9be8b874e1785b5..."
}
```

NOTE: Squeezer will not store any sensitive data similar to `token`. For later usage please store the wallet details on a secure & safe environment.


[back to top](#table)

<a name="sendTransaction" />

## Send transaction

Initiate a new blockchain transaction.

```javascript
blockchainConnector.sendTransaction(options, callback)
```
- ``options`` - ***required***.
- ``options.amount`` - ***required***. Amount to send, 8 decimal max. (``0.01``).
- ``options.type`` - ***required***. Transaction type. (``ETH``).
- ``options.to`` - ***required***. Receiver's address
- ``options.token`` - ***required***. Wallet token
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
blockchainConnector.sendTransaction({
  amount: 0.01,
  type: 'ETH',
  to: '0x207E1a4F3Ab910D2164bC3646CFD0aF697f86713',
  token: "41dbecfb04541........"
}, (err, response) => {
  console.log(response)
});
```

Example response from server
```json
{
  "hash" : "0x4b9c1358fcbeb5434457355e3e8e44e10ebc6bec02d40c7a28046b1cfef99476"
}
```

[back to top](#table)

## Get transactions

Get transactions for a specific wallet

```javascript
blockchainConnector.getTransactions(options, callback)
```
- ``options`` - ***required***.
- ``options.walletId`` - ***required***. Wallet ID
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
blockchainConnector.getTransactions({
  walletId: "0dbeb851-b9e7-42e4-a448-71f8520f1ea3",
}, (err, response) => {
  console.log(response)
});
```

Example response from server
```json
{
  "message": "success",
  "data": [
    {
      "from": "0xc03f7B9bddF8aeeBCbA2f818E5f873f71b85EB5c",
      "to": "0x903f7B9bddF8aeeBCbA2f818E5f873f71b85EB5c",
      "amount": 0.99999999,
      "type": "in",
      "hash": "0xcf387e8d1a95bd3a5b54269aa0a228f159d3cd33fa9e946617c532c5cb8c77bb",
      "block": 891093,
      "status": 0,
      "itnStatus": 0,
      "createdAt": "2018-05-13 18:09:18",
      "updateAt": "2018-05-13 18:09:18"
    }
  ]
}
```

[back to top](#table)

<a name="getBalance" />

## Get balance

Get balance for a specific wallet

```javascript
blockchainConnector.getBalance(options, callback)
```
- ``options`` - ***required***.
- ``options.walletId`` - ***required***. Wallet ID
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
blockchainConnector.getBalance({
  walletId: "0dbeb851-b9e7-42e4-a448-71f8520f1ea3",
}, (err, response) => {
  console.log(response)
});
```

Example response from server
```json
{
  "message":"success",
  "data": {
    "balance":0
  }
}
```

[back to top](#table)

## Smart contract ( In development feature )

Access a smart contract

```javascript
blockchainConnector.smartContract(options, callback)
```
- ``options`` - ***required***.
- ``options.address`` - ***required***. Smart contract address.
- ``options.type`` - ***required***. Smart contract type. (``ETH``)
- ``options.abi`` - ***required***. Abi code.
- ``options.methods`` - ***required***. Smart contract methods.
- ``options.token`` - ***required***. Wallet token
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
blockchainConnector.smartContract({
  type: 'ETH',
  abi : '',
  address: '0x207E1a4F3Ab910D2164bC3646CFD0aF697f86713',
  token: '348nagfgf45tgtg....',
  methods: [{
    listVotes: ['arg1', 'arg2'],
    votesType: ['positive']
  }]
}, (err, response) => {
  console.log(response)
});
```

[back to top](#table)