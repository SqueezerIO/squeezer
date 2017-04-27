'use strict';

class FileutilsCMD {
  constructor(sqz) {
    this.sqz = sqz;

    this.commands = [
      {
        arg         : ['fileutils:copy'],
        summary     : 'Copy a file or directory. The directory can have contents. Like cp -r.',
        lifecycle   : [
          'fileutils:copy'
        ],
        description : null,
        options     : {
          overwrite          : {
            title        : 'overwrite existing file or directory, default is true.',
            flag         : 'o',
            description  : ' the copy operation will silently fail if you set this to false and the destination exists' +
            '. Use the errorOnExist option to change this behavior.',
            value        : false,
            required     : false,
            boolean      : true,
            defaultValue : true
          },
          errorOnExist       : {
            title        : ' when overwrite is false and the destination exists, throw an error. Default is false',
            flag         : 'e',
            description  : '',
            value        : false,
            required     : false,
            defaultValue : null
          },
          dereference        : {
            title        : 'dereference symlinks, default is false.',
            flag         : '',
            description  : '',
            value        : true,
            required     : false,
            defaultValue : null
          },
          preserveTimestamps : {
            title        : 'will set last modification and access times to the ones of the original source files, default is false.',
            flag         : 'p',
            description  : '',
            value        : true,
            required     : false,
            defaultValue : null
          },
          exclude             : {
            title        : 'Comma delimited paths to ne excluded dir1,dir2,file1,file',
            flag         : 'e',
            description  : '',
            value        : true,
            required     : false,
            defaultValue : null
          },
          src                : {
            title        : 'files/dir assets source path',
            flag         : 's',
            description  : '',
            value        : true,
            required     : true,
            defaultValue : null
          },
          dest               : {
            title        : 'destination path',
            flag         : 'd',
            description  : '',
            value        : true,
            required     : true,
            defaultValue : null
          }
        },
        examples    : [
          '',
          '--src source --dest dest',
          '--overwrite true --src source --dest dest'
        ]
      },
      {
        arg         : ['fileutils:empty'],
        summary     : 'Ensures that a directory is empty',
        lifecycle   : [
          'fileutils:empty'
        ],
        description : 'Deletes directory contents if the directory is not empty. If the directory does ' +
        'not exist, it is created. The directory itself is not deleted.',
        options     : {
          dir : {
            title        : 'Directory to be emptied',
            flag         : 'd',
            description  : '',
            value        : true,
            required     : true,
            defaultValue : null
          }
        }
      },
      {
        arg         : ['fileutils:mkdir'],
        summary     : 'If the directory structure does not exist, it is created. Like mkdir -p.',
        lifecycle   : [
          'fileutils:empty'
        ],
        description : '',
        options     : {
          dir : {
            title        : 'Directory to be emptied',
            flag         : 'd',
            description  : '',
            value        : true,
            required     : true,
            defaultValue : null
          }
        }
      },
      {
        arg         : ['fileutils:link'],
        summary     : 'Ensures that the symlink exists. If the directory structure does not exist, it is created.',
        lifecycle   : [
          'fileutils:link'
        ],
        description : '',
        options     : {
          source  : {
            title        : 'symlink source',
            flag         : 's',
            description  : '',
            value        : true,
            required     : true,
            defaultValue : null
          },
          target : {
            title        : 'symlink target destination',
            flag         : 't',
            description  : '',
            value        : true,
            required     : true,
            defaultValue : null
          }
        }
      },
      {
        arg         : ['fileutils:move'],
        summary     : 'Moves a file or directory, even across devices.',
        lifecycle   : [
          'fileutils:move'
        ],
        description : '',
        options     : {
          overwrite          : {
            title        : 'overwrite existing file or directory, default is true.',
            flag         : 'o',
            description  : '',
            value        : false,
            required     : false,
            boolean      : true,
            defaultValue : true
          },
          source  : {
            title        : 'symlink source',
            flag         : 's',
            description  : '',
            value        : true,
            required     : true,
            defaultValue : null
          },
          target : {
            title        : 'symlink target destination',
            flag         : 't',
            description  : '',
            value        : true,
            required     : true,
            defaultValue : null
          }
        }
      },
      {
        arg         : ['fileutils:remove'],
        summary     : 'Removes a file or directory. The directory can have contents. Like rm -rf.',
        lifecycle   : [
          'fileutils:remove'
        ],
        description : '',
        options     : {
          path          : {
            title        : 'file or directory to remove.',
            flag         : 'p',
            description  : '',
            value        : false,
            required     : true,
            defaultValue : null
          }
        }
      },
      {
        arg         : ['fileutils:sync'],
        summary     : 'Sync two directories',
        lifecycle   : [
          'fileutils:sync'
        ],
        description : '',
        options     : {
          src  : {
            title        : 'source directory',
            flag         : 's',
            description  : '',
            value        : true,
            required     : true,
            defaultValue : null
          },
          dest : {
            title        : 'destination directory',
            flag         : 'd',
            description  : '',
            value        : true,
            required     : true,
            defaultValue : null
          }
        }
      }
    ];
  }
}

module.exports = FileutilsCMD;
