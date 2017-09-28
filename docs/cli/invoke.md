---
title: CLI - invoke
---
 
 Usage: 

    $ sqz invoke [options]

 Description:

    Invoke a function directly in the Cloud

 Options:

    --function / -f  function name (required)
      value
                     Function name stored in the sqz.config.yml file
 
    --path / -p      JSON event input file (optional)
      value
 
    --json / -j      JSON event input string (optional)
      value
 
    --stage          environment stage (optional) "dev"
      value
 

 Examples:

    $ sqz invoke 
    $ sqz invoke --function MyFunction
    $ sqz invoke -f MyFunction -p input.event.json
    $ sqz invoke -f MyFunction -j '{"a":"b"}'
