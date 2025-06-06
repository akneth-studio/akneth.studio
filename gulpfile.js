const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const path = require('path');
const ignore = require('gulp-ignore');

const paths = {
    html: {
        src: 'src/**/*.html',
        partials: 'src/partials/',
    },
    dest: 'public/'
};

function html() {
    return gulp.src([
        path.join(paths.html.src),
    ])
        .pipe(fileInclude({
            prefix: '@@',
            basepath: paths.html.partials,
        }))
        .pipe(gulp.dest(paths.dest));
}

function watchFiles() {
    gulp.watch([
        paths.html.src,
        paths.html.partials,
    ], html);
}

exports.html = html;
exports.watch = watchFiles;
exports.default = html;
