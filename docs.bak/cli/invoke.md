
## Invoke 

 
 Usage: 

    $ sqz invoke [options]

 Description:

    Invoke a function directly in the Cloud

 Options:

    --function / -f  function name (required)
    value
                   Function name stored in the sqz.config.yml file
 
    --stage          environment stage (optional) "dev"
    value 

 Examples:

    $ sqz invoke 
    $ sqz invoke --function MyFunction
