'use strict';

exports.digest = (params) => {
  const headers    = params.headers || {};
  const message    = params.message || 'success';
  const data       = params.data;
  const statusCode = params.statusCode || 200;

  if (!headers['Content-type']) {
    headers['Content-type'] = 'application/json';
  }

  if (process.env.CORS === 'enabled') {
    headers['Access-Control-Allow-Headers'] = '*';
    headers['Access-Control-Allow-Method']  = '*';
    headers['Access-Control-Allow-Origin']  = '*';
  }

  const ret = {
    statusCode : statusCode,
    headers    : headers,
    body       : JSON.stringify({
      message    : message,
      data       : data,
      statusCode : statusCode
    })
  };

  return ret;
};
