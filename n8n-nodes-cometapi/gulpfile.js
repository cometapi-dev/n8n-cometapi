const gulp = require('gulp');

gulp.task('build:icons', function () {
    return gulp.src('icons/**/*')
        .pipe(gulp.dest('dist/icons/'));
});
