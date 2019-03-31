---
title: CLI - deploy
---
 
 Usage: 

    $ sqz deploy [options]

 Description:

    Deploys the current project into the cloud.

 Options:

    --function / -f  function name (optional)
      value
                     Deploys only a specific function
 
    --force          force to deploy (optional)

                     Force a deployment even if there is no any code changes
 

 Examples:

    $ sqz deploy 
    $ sqz deploy --force
    $ sqz deploy --function my-function
