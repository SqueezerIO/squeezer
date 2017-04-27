
## Serve 

 
 Usage: 

    $ sqz serve [options]

 Description:

    If no options are specified all your available microservices where code changed from the last deployment will be deployed.

 Options:

    --stage environment stage (optional) "dev"
    value 

 Examples:

    $ sqz serve 
    $ sqz serve --stage dev --region us-east-1
    $ sqz serve --force
    $ sqz serve --microservice my-first-microservice
