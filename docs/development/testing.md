---
title: Development - Testing
---

Squeezer provides `end-to-end` tests . 

## API backend apps testing

Really easy & quick by using [ChaiHTTP](http://chaijs.com/plugins/chai-http/)

## Web apps testing

Testing apps using [WebDriverIO](http://webdriver.io/) framework, which is already
configured to work with Squeezer without involving any configs , just one ready-to-go feature !

## Workflow

Every microservice contains a YAML test file where you simply add your test scripts

`sqz.tests.yml` :

```yaml
- db.js
- web.js
- api.js
```

```
microservice
└── src
    ├── lib
    └── tests
```

## End-to-end testing

Recommended to use it after you already deployed project resources into the cloud platform. 
Run tests on deployed database tables , API endpoints , Web apps,  etc.

## Run tests
`$ sqz test` 

## CI plan

**NOTE**: Don't forget to deploy the resources before running the tests

```bash
$ sqz install
$ sqz compile --cloud
$ sqz test --smart
$ sqz deploy
```
