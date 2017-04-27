'use strict';

const _ = require('lodash');

/**
 * Class that build the AWS API gateway context
 */
class Event {
  constructor(sqz, req, data) {
    this.sqz  = sqz;
    this.req  = req;
    this.data = data;
  }

  init() {
    const path = this.req.url.split('?')[0];

    this.event = {
      resource              : `${this.data.event.path}`,
      path                  : path,
      httpMethod            : this.req.method,
      headers               : _.assign(this.req.headers, {
        'CloudFront-Forwarded-Proto'   : 'https',
        'CloudFront-Is-Desktop-Viewer' : true,
        'CloudFront-Is-Mobile-Viewer'  : false,
        'CloudFront-Is-SmartTV-Viewer' : false,
        'CloudFront-Is-Tablet-Viewer'  : false,
        'CloudFront-Viewer-Country'    : 'US'
      }),
      queryStringParameters : this.req.query,
      pathParameters        : this.data.pathParameters,
      stageVariables        : null,
      requestContext        : {
        accountId    : null,
        resourceId   : null,
        stage        : null,
        requestId    : null,
        identity     : {
          cognitoIdentityPoolId         : null,
          accountId                     : null,
          cognitoIdentityId             : null,
          caller                        : null,
          apiKey                        : null,
          sourceIp                      : this.req.connection.remoteAddress,
          accessKey                     : null,
          cognitoAuthenticationType     : null,
          cognitoAuthenticationProvider : null,
          userArn                       : null,
          userAgent                     : 'Apache-HttpClient/4.5.x (Java/1.8.0_102)',
          user                          : null
        },
        resourcePath : path,
        httpMethod   : this.req.method,
        apiId        : null
      },
      body                  : this.req.rawBody,
      isBase64Encoded       : false
    };
  }

  /**
   * Build the API gateway event data
   */
  build() {
    this.init();

    return this.event;
  }
}

module.exports = Event;
