
## Create 

 
 Usage: 

    $ sqz create [options]

 Description:

    Create a Squeezer project

 Options:

    --project / -p      Project's name (required)
 
    --email / -e        Project's owner email address (required)
 
    --template / -t     Project's template , get available templates : sqz templates (required)
 
    --noChecksums / -n  Disable microservices checksum, this will make the deployment sequence considerably slower (optional)
 

 Examples:

    $ sqz create --name my-first-project --template aws-api-nodejs
    $ sqz create --name my-first-project --template aws-api-nodejs --noChecksum true
