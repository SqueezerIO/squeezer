---
title: CLI - test
---
 
 Usage: 

    $ sqz test [options]

 Description:

    Run tests on your project

 Options:

    --function / -f  function name (optional)
      value
                     run tests for a specific function
 
    --smart / -s     run smart tests (optional)

                     Will trigger tests only for functions where code changed from the previous deployment
 

 Examples:

    $ sqz test 
    $ sqz test --function hello
    $ sqz test -f hello
    $ sqz test --smart
    $ sqz test -s
