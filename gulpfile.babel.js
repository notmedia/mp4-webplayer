import gulp from 'gulp';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import newer from 'gulp-newer';
import jade from 'gulp-jade';
import nodemon from 'gulp-nodemon';

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**', '!public/lib/**'],
  static: ['./package.json', 'public/lib/**'],
  views: ['./public/views/*']
};

gulp.task('lint', () => {
  return gulp.src(paths.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('copy', () => {
  gulp.src([...paths.static], { base: '.' })
    .pipe(newer('dist'))
    .pipe(gulp.dest('dist'));
});

gulp.task('jade', () => {
  gulp.src(paths.views, { base: '.' })
    .pipe(newer('dist'))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['jade', 'copy'], () => {
  gulp.src([...paths.js], { base: '.' })
    .pipe(newer('dist'))
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], () => {
  nodemon({
    script: 'dist/app.js',
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'build']
  });
});
