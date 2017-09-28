---
title: Development - CORS
---

https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS

Enable it for all microservices `squeezer.yml` or for a specific one `sqz.config.yml`

```yaml
env:
  CORS: 'enabled'
```

It will add this headers for every HTTP return payload :

```
Access-Control-Allow-Headers:*
Access-Control-Allow-Method:*
Access-Control-Allow-Origin:*
```
