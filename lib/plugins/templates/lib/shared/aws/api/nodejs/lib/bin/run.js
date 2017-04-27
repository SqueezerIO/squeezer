#!/usr/bin/env node

'use strict';

const path = require('path');
const fs   = require('fs');

const handlerFile = process.argv[2];
const handler     = process.argv[3];
const event       = process.argv[4] || {};
const eventData = JSON.parse(event);
const context   = {};

context.succeed = (msg) => {
  const succeedMsg     = JSON.stringify(msg.body) || '';

  fs.writeFileSync(
    `${__dirname}/../../.build/development/response`,
    succeedMsg
  );

  process.stdout.write(`${succeedMsg}\n`);
  process.exit(0);
};

context.fail = (msg) => {
  const failMsg = JSON.stringify(msg.body) || '';
  fs.writeFileSync(
    `${__dirname}/../../.build/development/response`,
    failMsg
  );
  process.exit(1);
};

const func = require(`${handlerFile}`);

if (!func[handler]) {
  throw new Error(
    `missing ${handler} handler ` +
    `on file ${handlerFile}`
  );
} else {
  func[handler](eventData, context);
}
