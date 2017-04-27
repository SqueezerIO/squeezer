
## Fileutils 


### Copy {#fileutils_copy}

 
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

### Empty {#fileutils_empty}

 
 Usage: 

    $ sqz fileutils:empty [options]

 Description:

    Deletes directory contents if the directory is not empty. If the directory does not exist, it is created. The directory itself is not deleted.

 Options:

    --dir / -d  Directory to be emptied (required)
    value 

### Mkdir {#fileutils_mkdir}

 
 Usage: 

    $ sqz fileutils:mkdir [options]

 Description:

    If the directory structure does not exist, it is created. Like mkdir -p.

 Options:

    --dir / -d  Directory to be emptied (required)
    value 

### Link {#fileutils_link}

 
 Usage: 

    $ sqz fileutils:link [options]

 Description:

    Ensures that the symlink exists. If the directory structure does not exist, it is created.

 Options:

    --source / -s  symlink source (required)
    value 
    --target / -t  symlink target destination (required)
    value 

### Move {#fileutils_move}

 
 Usage: 

    $ sqz fileutils:move [options]

 Description:

    Moves a file or directory, even across devices.

 Options:

    --overwrite / -o  overwrite existing file or directory, default is true. (optional) "true"
 
    --source / -s     symlink source (required)
    value 
    --target / -t     symlink target destination (required)
    value 

### Remove {#fileutils_remove}

 
 Usage: 

    $ sqz fileutils:remove [options]

 Description:

    Removes a file or directory. The directory can have contents. Like rm -rf.

 Options:

    --path / -p  file or directory to remove. (required)
 

### Sync {#fileutils_sync}

 
 Usage: 

    $ sqz fileutils:sync [options]

 Description:

    Sync two directories

 Options:

    --src / -s   source directory (required)
    value 
    --dest / -d  destination directory (required)
    value 
