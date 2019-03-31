---
title: CLI - compile
---
 
 Usage: 

    $ sqz compile [options]

 Description:

    Compile all the available functions ( pre-requirement for both development & deployments )

 Options:

    --function / -f  function name (optional)
      value
                     Compiles only a specific function
 
    --cloud / -c     enable cloud compiling, default is "development" (optional)

 
    --stage          environment stage (optional) "local"
      value
 

 Examples:

    $ sqz compile 
    $ sqz compile --cloud
    $ sqz compile --cloud --stage dev
