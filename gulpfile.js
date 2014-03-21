var path = require('path');
var http = require('http');

var ncp = require('ncp').ncp;
var openBrowser = require('open');
var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('connect');
var Metalsmith = require('metalsmith');

var static = {
}
//
var plugins = {
    "metalsmith-drafts": {},
    "metalsmith-markdown": {},
    // "metalsmith-permalinks": {
    //     "pattern": ":title"
    // },
    "metalsmith-templates": {
        "engine": "swig",
        "directory": "./templates"
    },
    "metalsmith-static": null
}

var site = require(path.resolve(__dirname, 'site.json'));

//
gulp.task('build', function(callback) {
    var metalsmith = new Metalsmith(process.cwd());

    metalsmith.source(site.source);
    metalsmith.destination(site.destination);
    metalsmith.metadata(site.metadata);

    for (var key in plugins) {
        var plugin;
        var opts = plugins[key];

        plugin = require(key);

        metalsmith.use(plugin(opts));
    }

    metalsmith.build(function(err){
        if (err) return process.exit(1);

        ncp('./assets', '_site/assets', function(err) {
            if (err) return process.exit(1);
            callback();
        });
    });
});

//
gulp.task('server', ['watch'], function(callback) {
    var devApp, devServer, devAddress, devHost, url, log=gutil.log, colors=gutil.colors;

    devApp = connect()
    .use(connect.logger('dev'))
    .use(connect.static('_site'));

    // change port and hostname to something static if you prefer
    devServer = http.createServer(devApp).listen(0 /*, hostname*/);

    devServer.on('error', function(error) {
        log(colors.underline(colors.red('ERROR'))+' Unable to start server!');
        callback(error); // we couldn't start the server, so report it and quit gulp
    });

    devServer.on('listening', function() {
        devAddress = devServer.address();
        devHost = devAddress.address === '0.0.0.0' ? 'localhost' : devAddress.address;
        url = ('http://' + devHost + ':' + devAddress.port + '/index.html');

        log('');
        log('Started dev server at '+colors.magenta(url));
        if(gutil.env.open) {
            log('Opening dev server URL in browser');
            openBrowser(url);
        } else {
            log(colors.gray('(Run with --open to automatically open URL on startup)'));
        }
        log('');
        callback(); // we're done with this task for now
    });
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch('./source/index.html', ['build', 'server']);
    gulp.watch('./templates/*.html', ['build', 'server']);
    gulp.watch(['./public/styles.css', './public/scripts.js'], ['build', 'server']);
    gulp.watch(['./assets/scss/**/*.scss', './assets/images/**/*.png'], ['build', 'server']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'server']);
