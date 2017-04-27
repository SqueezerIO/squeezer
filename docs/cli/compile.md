
## Compile 

 
 Usage: 

    $ sqz compile [options]

 Description:

    Compile all the microservices available , this is required before running functions locally or making cloud deployments 

 Options:

    --microservice / -m  microservice name (optional)
    value
                       Compiles only a specific microservice
 
    --production / -p    enable production compiling default is development (optional)
 

 Examples:

    $ sqz compile 
    $ sqz compile --stage dev --region us-east-1
    $ sqz compile --force
    $ sqz compile --microservice my-first-microservice
