var gulp = require('gulp');
var del = require('del');

var buildDir = 'build';

gulp.task('build', function() {
  gulp.src('*.txt')
    .pipe(gulp.dest(buildDir));
});

gulp.task('clean', function() {
  del.sync(buildDir);
});

gulp.task('help', function() {
  console.log('gulp build - copies 1.txt from this folder to ./build/');
  console.log('gulp clean - deletes the ./build/ folder');
});

gulp.task('default', ['help']);
