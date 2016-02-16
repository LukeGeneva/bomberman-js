var gulp = require('gulp');

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var uglify = require('gulp-uglify');

var bases = {
    pub: 'app/public/',
    dist: 'dist/'
};

var paths = {
    js: ['js/**/*.js', '!js/lib/**/*.js'],
    allJs: ['js/lib/phaser.min.js', 'js/*.js'],
    html: ['index.html'],
    assets: ['assets/*'],
    tests: ['tests/**/*.js']
};

gulp.task('default', ['clean', 'jshint', 'test', 'scripts', 'copy']);

gulp.task('clean', function() {
    return gulp.src(bases.dist)
    .pipe(clean());
});

gulp.task('jshint', function() {
    gulp.src(paths.js, {cwd: bases.pub})
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
    gulp.src(paths.tests)
        .pipe(mocha({reporter: 'list'}));
});

gulp.task('scripts', ['clean'], function() {
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
    gulp.watch('app/**/*', ['scripts', 'copy']);
});
