
## Test 

 
 Usage: 

    $ sqz test [options]

 Description:

    Run available tests on your current project

 Options:

    --microservice / -m  microservice name (optional)
    value
                       run tests for only a specific microservice
 
    --unit / -u          run available unit tests (optional)
 
    --integration / -i   run available integration tests (optional)
 

 Examples:

    $ sqz test 
    $ sqz test --microservice my-first-microservice
