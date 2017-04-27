'use strict';

const response = require('./inclusions/http/response');
const RestDB = require('./lib/db/rest');

const restDB = new RestDB();

exports.restAdd = (event, context) => {
  const body = JSON.parse(event.body);

  restDB
    .add(body)
    .then(() => {
      context.succeed(response.success(body));
    })
    .catch((data) => {
      context.fail(response.error(data));
    });
};

exports.restList = (event, context) => {
  restDB
    .list()
    .then((data) => {
      context.succeed(response.success(data));
    })
    .catch((err) => {
      context.fail(response.error(err));
    });
};

exports.restGet = (event, context) => {
  restDB
    .get(event.pathParameters.id)
    .then((data) => {
      context.succeed(response.success(data));
    })
    .catch((err) => {
      context.fail(response.error(err));
    });
};

exports.restRemove = (event, context) => {
  restDB
    .remove(event.pathParameters.id)
    .then((data) => {
      context.succeed(response.success(data));
    })
    .catch((err) => {
      context.fail(response.error(err));
    });
};

exports.restUpdate = (event, context) => {
  const body = JSON.parse(event.body);

  restDB
    .update(event.pathParameters.id, body)
    .then((data) => {
      context.succeed(response.success(data));
    })
    .catch((err) => {
      context.fail(response.error(err));
    });
};
