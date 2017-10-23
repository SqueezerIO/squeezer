---
title: Development - Deployment key
---

Each time when a new project is created the framework will assign a **deployment key** ,
which will be used later to compile, test & deploy only functions where code changed from the previous
deployment , making blazing fast cloud deployments .

`PROJECT_DIR/squeezer.yml` :

```yaml
key: b99bac9cd203b85c72d87bb11f99f635adsb99bac9cd203b85c72d87bb11f99f635
```

Note: If you don't want Squeezer to track you deployments just change the key value to `null`

```yaml
key: null
```