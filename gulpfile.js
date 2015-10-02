'use strict';

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var tap = require('gulp-tap');


// This gulp task now restarts after each JS error yaaaaay
gulp.task('watch', ['deepthought-watch'], function() {
  gutil.log('Watching node modules ...');
  gulp.watch('./src/**/*.js', ['babel']);
});

gulp.task('babel', function() {
  babelBundle();
});

gulp.task('default', ['babel', 'deepthought-babel']);

gulp.task('deepthought', ['deepthought-babel']);

gulp.task('deepthought-babel', function() {
  return gulp.src('deepthought/src/**/*.js')
    .pipe(babel({
      optional: ['runtime', 'es7.asyncFunctions', 'es7.objectRestSpread', 'es7.decorators'],
    }))
    .pipe(gulp.dest('./deepthought/lib'));
});

gulp.task('deepthought-watch', ['deepthought-babel'], function() {
  gulp.watch('./deepthought/src/**/*.js', ['deepthought-babel']);
});


function babelBundle() {
  var src = './src/**/*.js';
  var dist = './dist';

  gutil.log('Babel is generating ' + src + ' files to ' + dist + ' ...');

  return gulp.src(src)
    .pipe(plumber(gutil.log))
    .pipe(babel({ stage: 0, optional: ['runtime'] }))
    .pipe(gulp.dest(dist))
    .on('end', function() {
      gutil.log('Done babelifying');
    });
}
