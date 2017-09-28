---
title: Plugin - Lifecycle
---

Every CLI **command** is executed by loading and running a specific lifecycle.<br>
A lifecycle is executed in the next order : 1st `framework hooks` , 2nd `plugins hooks`.<br>
In order to add some priority to your plugins hooks you can use `"before:"` and `"after:"` 
prefixes ( *you can see how that works in the plugin example*  )   

```javascript
const lifecycle   = [
  'before:project:validate',
  'after:project:validate',
  'deploy:final'
];
```
