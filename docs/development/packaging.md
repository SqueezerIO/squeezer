---
title: Development - Packaging
---

## How to use the `packaging` feature  ?

`sqz.config.yml` 

```yaml
packaging:
  - node_modules
#  - other_dir
#  - other_file
```

This means that `node_modules` will be included in the microservice's *.zip package for later usage 
on the cloud environment.