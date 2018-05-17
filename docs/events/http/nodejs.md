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
    res.send(200, 'hello!');
  }, ...args);
}
```

#### req : <code>Object</code>
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> | http body object sent by request |
| method | <code>string</code> | Http method - GET, PUT, POST, DELETE, etc.. |
| path | <code>string</code> | A cleaned url string |
| url | <code>string</code> | base resource of url |
| headers | <code>Object</code> | header object containing all header information |
| params | <code>Object</code> | parameters object from url path - `/resource/{id}` = `{ id: <value> }` |
| query | <code>Object</code> | query parameters object from url - /resource?sort=asc = { sort: 'asc' } |
| clientIpAddress | <code>string</code> | Client ip address - `x.x.x.x` |
| clientCountry | <code>string</code> | Client ip address country - `US` |

#### res : <code>Object</code>
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| send | <code>function</code> | Sends the HTTP response. |
| json | <code>function</code> | Sends the HTTP JSON response. |
| header | <code>function</code> | Set header `key` to `value`, or pass an object of header fields. |

#### res.send(statusCode, body)
Formats statusCode, body to be sent as a HTTP response back to
api consumer (Api Gateway, Google Endpoint).
  The body parameter can be a a String, an object, or an Array.

| Param | Type | Description |
| --- | --- | --- |
| statusCode | <code>number</code> | [Http Response code]( https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) |
| body | <code>string</code> &#124; <code>Object</code> &#124; <code>Array</code> | Response body |

**Kind**: public function
**Returns**: <code>Object</code> - response HTTP response object formatted for Api Gateway.

#### res.json(statusCode, body)
Similar as `res.send` with the difference that the response will be in JSON content-type .

#### res.charset(val)
Set the `charset` for the content-type header , default is `utf-8`


#### res.header(key, value)
Set header `key` to `value`, or pass
an object of header fields.
**Examples:**

```js
res.header('Content-Type', 'application/json');
res.header('foo', 'bar');
```