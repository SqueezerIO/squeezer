---
title: AWS - Events - HTTP Event
---

You can invoke a Lambda function over HTTPS. You can do this by defining a custom REST API and 
endpoint using Amazon API Gateway. You map individual API operations, such as GET and PUT, to 
specific Lambda functions. When you send an HTTPS request to the API endpoint, the Amazon API 
Gateway service invokes the corresponding Lambda function.

`squeezer.yml` :

```yaml
description: "Hello World"
handler: "hello"
events:
  - type: http
    path: "/rest/v1/hello"
    method: "get"
```

`handler.js`

```js
exports.hello = (event, context) => {
  const response = {
    statusCode : 200,
    headers : {
      'Content-type': 'application/json'
    },
    body       : JSON.stringify({
      message    : 'success',
      data       : { 
        event : event,
        context : context
      }
    });
  }
  
  context.succeed(response);
};
```

`$ sqz deploy`

When the deployment is succefully delivered you should get the next value from the CLI output :

`[squeezer] API Base URL : https://72c1v318x8.execute-api.eu-central-1.amazonaws.com/dev`

Access the endpoint : 

`$ curl https://72c1v318x8.execute-api.eu-central-1.amazonaws.com/dev/rest/v1/hello`

`Output :` 

```json
{
	"data": {
		"event": {
			"resource": "/rest/v1/hello",
			"path": "/rest/v1/hello",
			"httpMethod": "GET",
			"headers": {
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Encoding": "gzip, deflate, sdch, br",
				"Accept-Language": "en-US,en;q=0.8",
				"CloudFront-Forwarded-Proto": "https",
				"CloudFront-Is-Desktop-Viewer": "true",
				"CloudFront-Is-Mobile-Viewer": "false",
				"CloudFront-Is-SmartTV-Viewer": "false",
				"CloudFront-Is-Tablet-Viewer": "false",
				"CloudFront-Viewer-Country": "RO",
				"Host": "72c1v318x8.execute-api.eu-central-1.amazonaws.com",
				"Upgrade-Insecure-Requests": "1",
				"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
				"Via": "1.1 65fad01acb2314ab24c8ab335907fb1d.cloudfront.net (CloudFront)",
				"X-Amz-Cf-Id": "ZnxiZSCv8a6JQAui87B5LozYSThidTW84HOtmT0PoO8YuksBNDCG2A==",
				"X-Forwarded-For": "89.37.114.250, 216.137.58.74",
				"X-Forwarded-Port": "443",
				"X-Forwarded-Proto": "https"
			},
			"queryStringParameters": null,
			"pathParameters": null,
			"stageVariables": null,
			"requestContext": {
				"accountId": "161498329478",
				"resourceId": "xsbiyo",
				"stage": "dev",
				"requestId": "d5141d8b-e7de-11e6-9f5e-5b7aa3504dfc",
				"identity": {
					"cognitoIdentityPoolId": null,
					"accountId": null,
					"cognitoIdentityId": null,
					"caller": null,
					"apiKey": null,
					"sourceIp": "89.37.114.250",
					"accessKey": null,
					"cognitoAuthenticationType": null,
					"cognitoAuthenticationProvider": null,
					"userArn": null,
					"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
					"user": null
				},
				"resourcePath": "/rest/v1/hello",
				"httpMethod": "GET",
				"apiId": "72c1v318x8"
			},
			"body": null,
			"isBase64Encoded": false
		},
		"context": {
			"callbackWaitsForEmptyEventLoop": true,
			"logGroupName": "/aws/lambda/HelloFuncFunction-dev",
			"logStreamName": "2017/01/31/[$LATEST]97620e54272a4b698b88de4fb27dd06f",
			"functionName": "HelloFuncFunction-dev",
			"memoryLimitInMB": "128",
			"functionVersion": "$LATEST",
			"invokeid": "d514ba1a-e7de-11e6-bdf4-df482d5dd82e",
			"awsRequestId": "d514ba1a-e7de-11e6-bdf4-df482d5dd82e",
			"invokedFunctionArn": "arn:aws:lambda:eu-central-1:161498329478:function:HelloFuncFunction-dev"
		}
	}
}
```
