'use strict';

const documentation = require('gulp-documentation');
const gulp          = require('gulp');

module.exports = () => {
  return gulp.src(`${__dirname}/../../lib/common/**/*/*.js`)
    .pipe(documentation('md', { filename : 'common.md' }))
    .pipe(gulp.dest('docs/plugin'));
};
