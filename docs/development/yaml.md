---
title: Development - Yaml
---

The Squeezer Framework is using `YAML` templates . 

### Include files

`PROJECT_DIR/squeezer.yml`

```yaml
foo: bar 
custom-vars: !!inc/file "custom-vars.yml"
```

`custom-vars.yml`

```yaml
a: 1
b: 2
```

**RESULT :** 

```yaml
foo: bar 
custom-vars:
  a: 1
  b: 2
```

### Template strings

```javascript
this.sqz.yaml.parse('file.yml', {
  vars : {
    a : 1
  }
});
```

`file.yml`

```
a: ${vars.a}
```

**RESULT :** 

```
a: 1
```
