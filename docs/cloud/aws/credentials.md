---
title: AWS - Configure Credentials
---

## Step 1 - Installing AWS Command Line interface

There are a number of different ways to install the AWS CLI on your machine, depending on what operating system and environment you are using:

- **On Microsoft Windows** – use the [MSI installer](http://docs.aws.amazon.com/cli/latest/userguide/installing.html#install-msi-on-windows).
- **On Linux, OS X, or Unix** – use [pip](http://docs.aws.amazon.com/cli/latest/userguide/installing.html#install-with-pip) 
(a package manager for Python software) or install manually with the [bundled installer](http://docs.aws.amazon.com/cli/latest/userguide/installing.html#install-bundle-other-os).
<br>**Note**<br>
 On OS X, if you see an error regarding the version of six that came with distutils in El Capitan, use the *--ignore-installed* option:<br><br>
`$ sudo pip install awscli --ignore-installed six`

## Step 2 - Adding a new AWS credentials profile

NOTE : please make sure that your AWS user is `IAM` **admin** privileged .

```
$ aws configure --profile my-first-project

AWS Access Key ID [None]: AKIAI44QH8DHBEXAMPLE
AWS Secret Access Key [None]: je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

## Step 3 - Adding the AWS profile to the Squeezer project

```
$ sqz config --setting aws_profile --value my-first-project
```
