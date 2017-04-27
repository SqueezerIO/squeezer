
## Logs 

 
 Usage: 

    $ sqz logs [options]

 Description:

    Output the logs of a deployed function

 Options:

    --function / -f  function name (required)
    value
                   Name stored in the sqz.config.yml file
 
    --stage / -s     environment stage (optional) "dev"
    value 
    --region / -r    cloud region (optional) "us-east-1"
    value 

 Examples:

    $ sqz logs 
    $ sqz logs --function MyFunction
