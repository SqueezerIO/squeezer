#!/usr/bin/env node

'use strict';

const fs   = require('fs');

const handlerFile = process.argv[2];
const handler     = process.argv[3];
const eventInputFile = process.argv[4];
const eventData      = JSON.parse(fs.readFileSync(eventInputFile))
const context   = {};

context.succeed = (msg) => {
  const succeedMsg     = msg.body || '';

  fs.writeFileSync(
    `${__dirname}/../../.build/development/response`,
    succeedMsg
  );

  process.exit(0);
};

context.fail = (msg) => {
  const failMsg = msg || '';

  throw new Error(failMsg);
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
