var gulp = require('gulp');

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

var bases = {
    pub: 'app/public/',
    dist: 'dist/'
};

var paths = {
    js: ['js/**/*.js', '!js/lib/**/*.js'],
    allJs: ['js/lib/*.js', 'js/*.js'],
    html: ['index.html'],
    assets: ['assets/*']
};

gulp.task('default', ['build-dev']);
gulp.task('build-dev', ['clean', 'jshint', 'scripts-dev', 'copy']);
gulp.task('build-release', ['clean', 'jshint', 'scripts-release', 'copy']);

gulp.task('clean', function() {
    return gulp.src(bases.dist)
    .pipe(clean());
});

gulp.task('jshint', function() {
    gulp.src(paths.js, {cwd: bases.pub})
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts-dev', ['clean'], function() {
    gulp.src(paths.allJs, {cwd: bases.pub})
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(bases.dist + 'js/'));
});

gulp.task('scripts-release', ['clean'], function() {
    gulp.src(paths.allJs, {cwd: bases.pub})
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(bases.dist + 'js/'));
});

gulp.task('copy', ['clean'], function() {
    gulp.src(paths.html, {cwd: bases.pub})
        .pipe(gulp.dest(bases.dist));

    gulp.src(paths.assets, {cwd: bases.pub})
        .pipe(gulp.dest(bases.dist + 'assets/'));
});

gulp.task('watch', function() {
    gulp.watch(['app/**/*'], ['default']);
});
