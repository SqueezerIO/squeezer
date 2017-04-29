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

  const ret = {
    statusCode : 400,
    body       : JSON.stringify({
      message    : 'error',
      data       : err,
      statusCode : 400
    })
  };

  return ret;
};
