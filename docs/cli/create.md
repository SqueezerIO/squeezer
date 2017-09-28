---
title: CLI - create
---
 
 Usage: 

    $ sqz create [options]

 Description:

    Create a Squeezer project

 Options:

    --project / -p      Project's name (optional) "my-first-project"

 
    --template / -t     Project's template , get available templates : "sqz templates" (required)

 
    --noChecksums / -n  Disable functions checksum, this will make the deployment sequence considerably slower (optional)

 

 Examples:

    $ sqz create --name my-first-project --template aws-api-nodejs
    $ sqz create --name my-first-project --template aws-api-nodejs --noChecksum true
