'use strict';

exports.success = (data) => {
  const ret = {
    statusCode : 200,
    body       : JSON.stringify({
      message    : 'success',
      data       : data,
      statusCode : 200
    })
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
