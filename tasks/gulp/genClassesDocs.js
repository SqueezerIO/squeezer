'use strict';

const documentation = require('gulp-documentation');
const appRoot       = require('app-root-path');
const gulp          = require('gulp');

module.exports = () => {
  return gulp.src(`${appRoot}/lib/common/**/*/*.js`)
    .pipe(documentation('md', { filename : 'common.md' }))
    .pipe(gulp.dest('docs'));
};
