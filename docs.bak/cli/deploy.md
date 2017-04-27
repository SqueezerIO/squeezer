
## Deploy 

 
 Usage: 

    $ sqz deploy [options]

 Description:

    If no options are specified all your available microservices where code changed from the last deployment will be deployed.

 Options:

    --microservice / -m  microservice name (optional)
    value
                       Deploys only a specific microservice
 
    --force / -f         force deployement (optional)

                       Force deployment for all the current microservices 
                       NOTE : Will deploy all microservices , even the ones with no code changes from the last deployment.
 
    --stage              environment stage (optional) "dev"
    value 

 Examples:

    $ sqz deploy 
    $ sqz deploy --stage dev --region us-east-1
    $ sqz deploy --force
    $ sqz deploy --microservice my-first-microservice
