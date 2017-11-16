---
title: AWS - Configure Credentials
---

### Add a new IAM user

Attach the following Policy Document to the IAM user:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:DescribeStacks",
                "cloudformation:CreateStack",
                "cloudformation:DeleteStack",
                "cloudformation:UpdateStack",
                "s3:*",
                "iam:*",
                "apigateway:*",
                "lambda:*",
                "events:*",
                "aws:*",
                "logs:*",
                "sns:*",
                "ses:*"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```

### Provider

```
$ sqz config --setting provider --value aws
```

### Access Key ID

```
$ sqz config --setting aws_access_key_id --value "AKIAI44QH8XXXXXXXXX"
```

### Secret Access Key

```
$ sqz config --setting aws_secret_access_key --value "je7MtGbClwBFxxxxxxxxxxxxxxx"
```

### Region

```
$ sqz config --setting aws_region --value "us-east-1"
```