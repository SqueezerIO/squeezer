'use strict';

const response = require('./inclusions/http/response');
const pug      = require('pug');

exports.hello = (event, context) => {
  const CloudFrontDomain = process.env.CloudFrontDomain;
  const templateData = pug.renderFile('./web/templates/default.pug', {
    pageTitle     : 'Hello World !!!',
    mainAssetsUrl : process.env.MAIN_ASSETS_URL || `https://${CloudFrontDomain}/${process.env.MAIN_ASSETS_URL_PATH}`,
    assetsUrl     : process.env.ASSETS_URL || `https://${CloudFrontDomain}/${process.env.ASSETS_URL_PATH}`,
    pretty        : true
  });

  context.succeed(
    response.digest({
      headers : {
        'http-header-1' : 'value'
      },
      data: templateData,
      statusCode: 200
    })
  );
};
