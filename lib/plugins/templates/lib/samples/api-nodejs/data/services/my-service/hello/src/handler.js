'use strict';

import event from 'squeezer-event-node';
import vars from './vars';

exports.handler = (...args) => event(vars, (req, res) => {
  res.json(200, {
    name : `Your name : ${req.params.name}`,
    number : `Your favorite number : ${req.query.number}`,
    message: req.body.message || 'hello world !!!'
  });
}, ...args);
