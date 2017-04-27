'use strict';

const response = require('./inclusions/http/response');

exports.hello = (event, context) => {
  context.succeed(response.success({
    text  : 'Hello World!',
    event : event
  }));
};
