---
title: Events - HTTP - Configure
---

#### Hook it up with a function

`FUNCTION/squeezer.yml` :

```yaml
event:
  type: http
  path: /rest/v1/hello
  methods:
    - GET
    # - POST
```

#### Parameters 

`/url/path/{id}`

On this case the *{id}* param can be accessed later on your handler as **req.id**

#### Wildcard

`/url/path/*`

Every sub path added after the */url/path* will be threated as a wildcard path

#### Global HTTP headers

`PROJECT_DIR/squeezer.yml`

Enable a header trough all available functions .

```yaml
vars:
  response-http-headers:
    Access-Control-Allow-Origin: "*"
    custom-header-1: "foo bar"
```