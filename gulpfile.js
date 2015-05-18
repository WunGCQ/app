var gulp = require('gulp');
var spawn = require('child_process').spawn;
var plugins = require('gulp-load-plugins')({lazy: false});

// for dev; remove `lazy: false` before released
// console.log(plugins);

var config = {
    styles: {
        root: 'styles',
        sassFiles: 'styles/**/*.scss',
        cssDir: 'styles',
        distDir: 'dist/styles'
    },
    scripts: {
        root: 'scripts',
        scriptFiles: 'scripts/**/*.js',
        jsDir: 'scripts',
        distDir: 'dist/scripts'
    },
    jade: {
        root: 'views',
        jadeFiles: 'views/**/*.jade'
    },
    test: {
        root: 'test',
        files: 'test/**/*-spec.js',
        casperFiles: ['test/components/tooltip-casper.js'],
        reporter: 'spec'
    },
    livereload: {

    },
    connect: {
        livereload: true
    }
};

// sass -> css > .min
gulp.task('styles', function(){
    return gulp.src(config.styles.sassFiles)
        .pipe(plugins.sass({style: 'expanded'}))
        .pipe(plugins.autoprefixer('last 5 versions'))
        .pipe(gulp.dest(config.styles.cssDir))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.styles.distDir))
        .pipe(plugins.livereload());
});

// js -> .min
gulp.task('scripts', function(){
    return gulp.src(config.scripts.scriptFiles)
        // .pipe(plugins.jshint('.jshintrc'))
        // .pipe(plugins.jshint.reporter('default'))
        .pipe(gulp.dest(config.scripts.distDir))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(config.scripts.distDir))
        .pipe(plugins.livereload());
});

// jade
gulp.task('jade', function(){
    return gulp.src(config.jade.root)
        .pipe(plugins.livereload());
});

// build: concat spec styles|scripts
gulp.task('build', function(){

});

gulp.task('plainTest', function(){
    return gulp.src(config.test.files)
        .pipe(plugins.mocha({
            reporter: 'spec'
        }));
});
gulp.task('casperTest', function(){
    var casperChild = spawn('mocha-casperjs', config.test.casperFiles.concat(['--reporter=' + config.test.reporter]));
    var result = '';
    casperChild.stdout.on('data', function (data) {
        result += data;
    });
    casperChild.on('close', function (code) {
        console.log(result.toString());
    });
});

// mocha test task
gulp.task('test',['plainTest']);

// watch file changes, then run tasks
gulp.task('watch', function(){
    plugins.livereload.listen();
    gulp.watch(config.styles.sassFiles, ['styles']);
    gulp.watch(config.scripts.scriptFiles, ['scripts']);
    gulp.watch(config.jade.jadeFiles, ['jade']);
});


gulp.task('dev', function(){
    gulp.start('watch');
});