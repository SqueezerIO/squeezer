'use strict';

const response = require('./inclusions/http/response');
const RestDB   = require('./lib/db/rest');

const restDB = new RestDB();

exports.restAdd = (event, context) => {
  const body = JSON.parse(event.body);

  restDB
    .add(body)
    .then((data) => {
      context.succeed(response.digest({
        message    : 'success',
        headers    : {
          'http-header-1' : 'value'
        },
        data       : data,
        statusCode : 200
      }));
    })
    .catch((err) => {
      context.succeed(response.digest({
        data       : err,
        message    : 'error',
        statusCode : 400
      }));
    });
};

exports.restList = (event, context) => {
  restDB
    .list()
    .then((data) => {
      context.succeed(response.digest({
        data       : data,
        statusCode : 200
      }));
    })
    .catch((err) => {
      context.succeed(response.digest({
        data       : err,
        message    : 'error',
        statusCode : 400
      }));
    });
};

exports.restGet = (event, context) => {
  restDB
    .get(event.pathParameters.id)
    .then((data) => {
      context.succeed(response.digest({
        data       : data,
        statusCode : 200
      }));
    })
    .catch((err) => {
      context.succeed(response.digest({
        data       : err,
        message    : 'error',
        statusCode : 400
      }));
    });
};

exports.restRemove = (event, context) => {
  restDB
    .remove(event.pathParameters.id)
    .then((data) => {
      context.succeed(response.digest({
        data       : data,
        statusCode : 200
      }));
    })
    .catch((err) => {
      context.succeed(response.digest({
        data       : err,
        message    : 'error',
        statusCode : 400
      }));
    });
};

exports.restUpdate = (event, context) => {
  const body = JSON.parse(event.body);

  restDB
    .update(event.pathParameters.id, body)
    .then((data) => {
      context.succeed(response.digest({
        data       : data,
        statusCode : 200
      }));
    })
    .catch((err) => {
      context.succeed(response.digest({
        data       : err,
        message    : 'error',
        statusCode : 400
      }));
    });
};
