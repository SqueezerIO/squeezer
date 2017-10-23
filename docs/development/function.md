---
title: Development - Function
---

### Event

Any function can be trigger by a specific event .

`FUNCTION/squeezer.yml`

```yaml
event:
  type: http
  path: /rest/v1/hello
  methods:
    - GET
```

### Memory

You can increase the memory allocate for your function or your cpu speed which is directly adjusted to your memory size, default is `128` MB .

`FUNCTION/squeezer.yml`

```
memory: 256
```

### Timeout

In order to not get billed for infinite loop functions , you can set a timeout value for your function , default is `6` .

`FUNCTION/squeezer.yml`

```
timeout: 30
```