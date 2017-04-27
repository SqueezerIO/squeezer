'use strict';

const response = require('./inclusions/http/response');
const pug      = require('pug');

exports.hello = (event, context) => {
  context.succeed(
    response.success(
      pug.renderFile(`./web/templates/default.pug`, {
        pageTitle     : 'Hello World !!!',
        mainAssetsUrl : process.env.MAIN_ASSETS_URL,
        assetsUrl     : process.env.ASSETS_URL,
        pretty        : true
      })
    )
  );
};
