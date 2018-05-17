---
title: Events - Http - Nodejs
---

#### Install

`npm i squeezer-event-node --save`

`src/handler.js`

```javascript
'use strict';

import event from 'squeezer-event-node';
import vars from './.vars';

export function handler(...args) {
  event(vars, (req, res) => {
    console.log('triggered by schedule event');
    res.done();
  }, ...args);
}
```
