'use strict';

var argv = require( 'minimist' )( process.argv.slice( 2 ) );
// var browserSync = require( 'browser-sync' ).create();
var gulp = require( 'gulp' );
var $ = require( 'gulp-load-plugins' )();
var config = require( './gulp.config' );
var nodemon = require( 'nodemon' );

gulp.task( 'build', function () {

	return gulp
		.src( config.src )
		.pipe( $.if( config.babel, $.babel() ) )
		.pipe( $.jsbeautifier( config.jsbeautifier ) )
		.pipe( gulp.dest( config.dest ) );

} );


gulp.task( 'serve', [ 'build' ], function () {

	// ignore everything, manually trigger restart in watch task
	nodemon( { script: './build/cl-scraper.js', ignore: '.' } )
	.on( 'start', function () {

		console.log( 'nodemon started' );

	} )
	.on( 'restart', function () {

		console.log( 'nodemon restarted' );

	} );

	gulp.watch( [ './src/*.js' ], [ 'restart-nodemon' ] );

} );

gulp.task( 'restart-nodemon', [ 'build' ], function () {

	nodemon.emit( 'restart' );

} );
