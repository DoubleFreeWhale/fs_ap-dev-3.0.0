'use strict';

var gulp = require('gulp');
var postcss = require('gulp-postcss');
var px2rem = require('gulp-px2rem');
var cssmin = require('gulp-cssmin');
var salad = require('postcss-salad')(require('./salad.config.json'));

var px2remOptions = {
  replace: true
};

gulp.task('compile', function() {
  return gulp.src('./src/index-mobile.css')
    .pipe(postcss([salad]))
    .pipe(cssmin())
    .pipe(px2rem(px2remOptions))
    .pipe(gulp.dest('./lib'));
});

gulp.task('copyfont', function() {
  return gulp.src('./src/fonts/**')
    .pipe(cssmin())
    .pipe(gulp.dest('./lib/fonts'));
});

gulp.task('build', ['compile', 'copyfont']);
