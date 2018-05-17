'use strict';

import event from 'squeezer-event-node';
import fs from 'fs';

const vars = JSON.parse(fs.readFileSync('.vars.json', 'utf8'));

export function handler(...args) {
  event(vars, (req, res) => {
    res.json(200, {
      name: `Your name : ${req.query.name}`,
      message: req.body.message || 'hello world !!!'
    });
  }, ...args);
}
