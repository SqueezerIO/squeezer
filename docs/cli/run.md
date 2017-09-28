---
title: CLI - run
---
 
 Usage: 

    $ sqz run [options]

 Description:

    Run a function locally

 Options:

    --function / -f  function name (required)
      value
                     Function name stored in the sqz.config.yml file
 
    --path / -p      JSON event input file (optional)
      value
 
    --json / -j      JSON event input string (optional)
      value
 

 Examples:

    $ sqz run 
    $ sqz run -f MyFunction
    $ sqz run -f MyFunction -p input.event.json
    $ sqz run -f MyFunction -j '{"a":"b"}'
