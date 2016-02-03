var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano');
    autoprefixer = require('gulp-autoprefixer');
    htmlmin = require('gulp-htmlmin');
    imagemin = require('gulp-imagemin');
    clean = require('gulp-clean');

gulp.task('default', ['clean'], function () {

  gulp.src('img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));

  return gulp.src('*.html')
      .pipe(useref())
      .pipe(gulpif(['*.js', '!js/lib/**'], uglify()))
      .pipe(gulpif('*.css', autoprefixer({
        browsers: ['last 2 versions'],
			  cascade: false })))
      .pipe(gulpif('*.css', cssnano()))
      .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});
