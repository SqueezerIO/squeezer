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



## Blockchain Connector

**https://github.com/SqueezerIO/squeezer-blockchain-connector**


### Initialize

```
const blockchainConnector = require('squeezer-blockchain-connector').init({ 
  key : 'squeezer-key',
  type: 'ETH',
  environment: 'test'
});
```
Created api-key is used when generate new wallet

## Using connector

### Create new Wallet

```
POST /v1/wallets/CreateWallet
```

#### Description
Create new wallet address using api-key


#### Parameter

* <b>accessKey</b> - api-key generated at connector initialization
* <b>currencyType</b> - what type of wallet want

#### Return format

A JSON object with keystore and address of wallet

#### Example

<b>Request</b>

```
POST /v1/wallets/CreateWallet
```

<b>Body</b>

```
{
  "accessKey": "3fb1cd2cd96c6d5c0b5eb3322d807b34482481d4"
}
```

<b>Response</b>
```
{
  "version": 3,
  "id": "f0efc549-88c0-45cf-9991-6ec53ba7ba13",
  "address": "7c110b7761b695d4343f6dfe786a49cd5c03e31e",
  "crypto": {
    "ciphertext": "6ec3946b5ed85d1acd5c2b67289ea05bee0b3095cdf3661469a6d8acc6cf85f5",
    "cipherparams": {
      "iv": "ea54225d082c7a010467d73b3a309eda"
    },
    "cipher": "aes-128-ctr",
    "kdf": "scrypt",
    "kdfparams": {
      "dklen": 32,
      "salt": "dfc9c26cda4253852b93c60f7d7099a5b3f127031faf19e2dbf0593a0d3190f8",
      "n": 262144,
      "r": 8,
      "p": 1
    },
    "mac": "ce5c87d1b0d0b2df0fbe4f389806594203fa091be4beaa6bfa6e1a10856d369e"
  }
}
```

### Get balance

```
POST /v1/wallets/GetBalance
```

#### Description

Get balance of specified address

#### Parameters

* <b>walletAddress</b> - wallet's address
* <b>network</b> - if use test environment should be passed network (rinkeby, ropsten, kovan - ETH, bitcoin-testnet -BTC)

#### Return format
A string with amount of wallet

#### Example
<b>Request</b>
```
POST /v1/wallets/GetBalance
```
<b>Body</b>
```
{
  "walletAddress": "0xc1f9e93081e7797ec3ef2134e0e656b2c8d542f1"
}
```
<b>Response</b>
```
"1.895178899999999998"
```
### Send transaction

```
POST /v1/blockchainlink/SendTransaction
```

#### Description

Send coins from one wallet to another

#### Parameters

* <b>toWallet</b> - wallet's address
* <b>currencyType</b> - what type of wallet want
* <b>amount</b> - amount of coins
* <b>keyStore</b> - fromWallet's keystore
* <b>accessKey</b> - api-key used to generate wallet
* <b>network</b> - if use test environment should be passed network (rinkeby, ropsten, kovan - ETH and bitcoin-testnet -BTC)

#### Return format

A JSON object that contain informations about that transaction

#### Example

<b>Request</b>
```
POST /v1/wallets/SendTransaction
```
<b>Body</b>
```
{
  "toWallet": "0x8a5cf6d5e86ebfe3e1ab573d1eafc299c04c8cf9",
  "amount": 0.001,
  "keyStore": {
    "version": 3,
    "id": "0af46c1e-4d02-4f9b-af62-ec358612a3c2",
    "address": "c1f9e93081e7797ec3ef2134e0e656b2c8d542f1",
    "crypto": {
      "ciphertext": "cc3bb088bd53ea45172b0ab5f01c9e28e6b7b3743a589a4437844b9fce922888",
      "cipherparams": {
        "iv": "55b1aeeffa8ce3ffe24a488e58174c0f"
      },
      "cipher": "aes-128-ctr",
      "kdf": "scrypt",
      "kdfparams": {
        "dklen": 32,
        "salt": "0c990d41edcf0d8f5541713ef0e2f0629366ffadb8190b0d3a32755488de6877",
        "n": 262144,
        "r": 8,
        "p": 1
      },
      "mac": "4ea78c87318dbe87ac4e109845301d248d4caf25f82882dff1fbaa1fe4b3d70c"
    }
  },
  "accessKey": "3fb1cd2cd96c6d5c0b5eb3322d807b34482481d4",
  "network" : "rinkeby"
}
```
<b>Response</b>
```
{
  "transaction": {
    "transaction": "0xad63f8fc7db990058ef3ec6433190cbc5b0e0af670be79c49a70d8e1daacfb29",
    "transactionStatus": 0,
    "_id": "5ab2b1fd6e578b3ae275e351",
    "__v": 0
  }
}
```
### Get transaction

```
POST /v1/blockchainlink/GetTransaction
```

#### Description

Get info about one transaction

#### Parameters

* <b>transactionHash</b> - transaction hash returned by SendTransaction
* <b>network</b> - if use test environment should be passed network (rinkeby, ropsten, kovan - ETH and bitcoin-testnet -BTC)

#### Return format

A JSON object that contain informations about transaction

#### Example

<b>Request</b>
```
POST /v1/wallets/GetTransaction
```
<b>Body</b>
```
{
  "transactionHash": "0xad63f8fc7db990058ef3ec6433190cbc5b0e0af670be79c49a70d8e1daacfb29",
  "currencyType" : "ETH",
  "network" : "rinkeby"
  new
}
```
<b>Response</b>
```
{
  "blockHash": "0xb589d75b759436e43381dc30f89a792f6f7bace421bf04f5eb1f2cca7c8e0628",
  "blockNumber": 1972693,
  "from": "0xc1f9e93081e7797ec3ef2134e0e656b2c8d542f1",
  "gas": 21000,
  "gasPrice": "1000000000",
  "hash": "0xad63f8fc7db990058ef3ec6433190cbc5b0e0af670be79c49a70d8e1daacfb29",
  "input": "0x",
  "nonce": 11,
  "to": "0x8a5cf6d5e86ebfe3e1ab573d1eafc299c04c8cf9",
  "transactionIndex": 9,
  "value": "1000000000000000",
  "v": "0x1b",
  "r": "0xf62198309971d6c3725f2f0cddc7eb60da5715fed89b597d4a273322313aebe4",
  "s": "0x5b86ac969b259c73d7fccc3dec9f28fdbdc024a8f72c842939baeb198eb9b6b1"
}
```