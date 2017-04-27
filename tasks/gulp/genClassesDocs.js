'use strict';

const documentation = require('gulp-documentation');
const appRoot       = require('app-root-path');
const gulp          = require('gulp');

module.exports = () => {
  return gulp.src(`${appRoot}/lib/common/**/*/*.js`)
    .pipe(documentation('md', { filename : 'common.md' }))
    .pipe(gulp.dest('docs'));
};

// const appRoot       = require('app-root-path');
// const documentation = require('gulp-documentation');
// const gulp          = require('gulp');
// const rename        = require('gulp-rename');
// const walkSync      = require('walk-sync');
// const _             = require('lodash');
// const flatmap       = require('gulp-flatmap');
//
// module.exports = () => {
//   const spacing  = '    ';
//   let addedPaths = [];
//   let cliTree    = '';
//
//   let buildTree = () => {
//     const paths = walkSync(`${appRoot}/lib/common`, { globs : ['**/deploy.js'], ignore : ['**/tests/*'] });
//
//     _.forEach(paths, (path) => {
//       console.log(path);
//       let dirPaths = path.split('/').slice(0, -1);
//       console.log(dirPaths);
//       let classBase = dirPaths.slice(0, -1).join('_');
//
//       if (addedPaths.indexOf(classBase) < 0) {
//         cliTree = `${cliTree}${' '.repeat(index)} * `;
//         addedPaths.push(classBase);
//       }
//     });
//     console.log(cliTree);
//
//   }
//
//   buildTree();
//
//   return gulp.src([`${appRoot}/lib/**/create.js`, `!**/tests/*.js`])
//     .pipe(flatmap((stream, file) => {
//       let paths = file.path.split('lib/')[1].split('/').slice(0, -1);
//
//       return stream
//         .pipe(documentation({ format : 'md', filename : `${paths.join('_')}.md` }))
//     }))
//     .pipe(gulp.dest(`${appRoot}/md/classes`));
// };
