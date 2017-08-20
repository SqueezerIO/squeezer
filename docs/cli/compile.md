
## Compile 

 
 Usage: 

    $ sqz compile [options]

 Description:

    Compile all the microservices available , this is required before running functions locally or making cloud deployments 

 Options:

    --microservice / -m  microservice name (optional)
    value
                       Compiles only a specific microservice
 
    --cloud / -p         enable cloud compiling, default is development (optional)
 

 Examples:

    $ sqz compile 
    $ sqz compile --cloud
