'use strict';

const gulp = require('gulp');

// /* generate documentation from CLI data */
// gulp.task('gen-cli-docs', require('./tasks/gulp/genCliDocs'));

/* generate documentation from Javascript code classes */
gulp.task('gen-classes-docs', require('./tasks/gulp/genClassesDocs'));

/* generate documentation from Javascript code classes */
// gulp.task('gen-templates', require('./tasks/gulp/genTemplates'));
