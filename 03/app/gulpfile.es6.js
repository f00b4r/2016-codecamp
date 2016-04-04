import gulp from 'gulp'
import gutil from 'gulp-util'
import bower from 'bower'
import concat from 'gulp-concat'
import sass from 'gulp-sass'
import minifyCss from 'gulp-minify-css'
import rename from 'gulp-rename'
import sh from 'shelljs'
import expect from 'gulp-expect-file'
import babel from 'gulp-babel'
import coffee from 'gulp-coffee'
import extReplace from 'gulp-ext-replace'
//var Dgeni = require('dgeni');

var bowerLibs = {
    js: [
        'ionic/js/ionic.bundle.min.js',
        'angular-resource/angular-resource.min.js',
        'angular-ui-router/release/angular-ui-router.min.js',
        'ngCordova/dist/ng-cordova.min.js',
        'moment/min/moment.min.js',
        'moment-timezone/builds/moment-timezone.min.js'
    ],
    css: [],
    fonts: [
        'ionic/fonts/*'
    ]
}

// prefix all bower components paths with the folder name
for (let key in bowerLibs) {
    let asset = bowerLibs[key]
    asset.map((lib, i) => { asset[i] = `bower_components/${lib}`})
}
    
var paths = {
    sass: ['./scss/**/*.{scss,sass}']
}

var es6Exts = '.es6.js'
var coffeeExts = '.coffee'

var ES6appFiles = []
var coffeeFiles = []

var appFiles = ['www/views/**/*', 'www/model/**/*', 'www/app/**/*']
appFiles.forEach(item => {
    ES6appFiles.push(item + es6Exts)
    coffeeFiles.push(item + coffeeExts)
})

gulp.task('scripts', () => {
    gulp.src(ES6appFiles, {base: './www'})
    .pipe(babel({
        sourceMaps: "both",
    }))
    .pipe(extReplace('.js', es6Exts))
    .pipe(gulp.dest('www/build'))

    gulp.src(coffeeFiles, {'base': './www'})
    .pipe(coffee({
        sourceMappingURL: true
    }))
    .pipe(gulp.dest('www/build'))
})

gulp.task('default', ['scripts', 'watch', 'sass'])

gulp.task('sass', done => {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', () => {
    gulp.watch([appFiles, paths.sass], ['sass', 'scripts']);
})

gulp.task('install', ['git-check'], () => {
    return bower.commands.install()
        .on('log', (data) => {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message)
        })
});

gulp.task('git-check', done => {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1)
    }
    done()
})

gulp.task('bowerlibs', ['bower-js-libs', 'bower-css-libs', 'bower-fonts'])

gulp.task('bower-js-libs', () => {
    return gulp.src(bowerLibs.js)
        .pipe(expect(bowerLibs.js))
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./www/js/'))
})

gulp.task('bower-css-libs', () => {
    return gulp.src(bowerLibs.css)
        .pipe(expect(bowerLibs.css))
        .pipe(concat('libs.css'))
        .pipe(gulp.dest('./www/css/'))
})

gulp.task('bower-fonts', () => {
    return gulp.src(bowerLibs.fonts)
        .pipe(gulp.dest('./www/fonts/'))
})

//gulp.task('dgeni', function() {
//    var dgeni = new Dgeni([require('./docs/docs-generate')]);
//    return dgeni.generate();
//});
