'use strict';

const response = require('./inclusions/http/response');

exports.hello = (event, context) => {
  context.succeed(response.digest({
    headers : {
      'http-header-1' : 'value'
    },
    message    : 'success',
    data       : {
      text  : 'Hello World!',
      event : event
    },
    statusCode : 200
  }));
};
