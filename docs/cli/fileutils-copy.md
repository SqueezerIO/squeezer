---
title: CLI - fileutils - copy
---
 
 Usage: 

    $ sqz fileutils:copy [options]

 Description:

    Copy a file or directory. The directory can have contents. Like cp -r.

 Options:

    --overwrite / -o           overwrite existing file or directory, default is true. (optional) "true"

                                the copy operation will silently fail if you set this to false and the destination exists. Use the errorOnExist option to change this behavior.
 
    --errorOnExist / -e         when overwrite is false and the destination exists, throw an error. Default is false (optional)

 
    --dereference              dereference symlinks, default is false. (optional)
      value
 
    --preserveTimestamps / -p  will set last modification and access times to the ones of the original source files, default is false. (optional)
      value
 
    --exclude / -e             Comma delimited paths to ne excluded dir1,dir2,file1,file (optional)
      value
 
    --src / -s                 files/dir assets source path (required)
      value
 
    --dest / -d                destination path (required)
      value
 

 Examples:

    $ sqz fileutils:copy 
    $ sqz fileutils:copy --src source --dest dest
    $ sqz fileutils:copy --overwrite true --src source --dest dest
