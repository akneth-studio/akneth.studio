const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const path = require('path');
const ignore = require('gulp-ignore');

const paths = {
    src: 'src/',
    partials: 'src/partials/',
    dest: 'docs/'
};

function html() {
    return gulp.src([path.join(paths.src, '**/*.html')])
        .pipe(ignore.exclude(paths.partials))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: paths.partials,
        }))
        .pipe(gulp.dest(paths.dest));
}

function watchFiles() {
    gulp.watch(path.join(paths.src, '**/*.html'), html);
}

exports.html = html;
exports.watch = watchFiles;
exports.default = html;