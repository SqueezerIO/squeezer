'use strict';

const assets = require('./assets');

exports.digest = (params) => {
  const headers    = params.headers || {};
  const data       = params.data;
  const statusCode = params.statusCode || 200;

  if (!headers['Content-type']) {
    headers['Content-type'] = 'text/html';
  }

  if (process.env.CORS === 'enabled') {
    headers['Access-Control-Allow-Headers'] = '*';
    headers['Access-Control-Allow-Method']  = '*';
    headers['Access-Control-Allow-Origin']  = '*';
  }

  const ret = {
    statusCode : statusCode,
    headers    : headers,
    body       : assets.cacheBuster(data)
  };

  return ret;
};
