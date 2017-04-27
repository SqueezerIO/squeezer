'use strict';

const assets = require('./assets');

exports.success = (data) => {
  const ret = {
    statusCode : 200,
    headers : {
      'Content-type': 'text/html'
    },
    body       : assets.cacheBuster(data)
  };

  return ret;
};

exports.error = (err) => {
  if (err.stack) {
    console.log(err.stack); // eslint-disable-line no-console
  }

  err.statusCode = 400;

  return {
    statusCode : 400,
    headers : {
      'Content-type': 'text/html'
    },
    body       : err
  };
};
