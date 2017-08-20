'use strict';

const documentation = require('gulp-documentation');
const gulp          = require('gulp');

module.exports = () => {
  return gulp.src('../../lib/common/**/*/*.js')
    .pipe(documentation('md', { filename : 'common.md' }))
    .pipe(gulp.dest('docs'));
};
