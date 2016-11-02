var gulp = require( 'gulp' ),
    jsbeautify = require( "gulp-jsbeautifier" ),
    fs = require( "fs" ),
    webpack = require( 'gulp-webpack' ),
    eslint = require( 'gulp-eslint' ),
    elntConfig,
    jsConfig,
    wpConfig = require( "./config/webpack" ),
    bblConfig;

elntConfig = JSON.parse( fs.readFileSync( './config/eslint.json' ) );
jsConfig = JSON.parse( fs.readFileSync( './config/js-beautify.json' ) );

gulp.task( 'default', () => {
    gulp.src( "gulpfile.js" )
        .pipe( jsbeautify( jsConfig ) )
        .pipe( gulp.dest( '.' ) );

    gulp.src( "tests/**" )
        .pipe( jsbeautify( jsConfig ) )
        .pipe( gulp.dest( 'tests' ) );

    gulp.src( "config/**" )
        .pipe( jsbeautify( jsConfig ) )
        .pipe( gulp.dest( 'config' ) );

    return gulp.src( "src/**/**.js" )
        .pipe( jsbeautify( jsConfig ) )
        .pipe( gulp.dest( 'src' ) )
        .pipe( webpack( wpConfig ) )
        .pipe( gulp.dest( 'js' ) );
} );
