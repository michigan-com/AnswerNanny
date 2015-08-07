var gulp = require('gulp');
var babel = require('gulp-babel');
var source = require('vinyl-source-stream');

gulp.task('default', ['babel']);

gulp.task('babel', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      optional: ['runtime', 'es7.asyncFunctions', 'es7.objectRestSpread', 'es7.decorators'],
    }))
    .pipe(gulp.dest('./lib'));
});

gulp.task('watch', ['babel'], function() {
  gulp.watch('./src/**/*.js', ['babel']);
});
