'use strict';

var express = require( 'express' );
var ASQ = require( 'asynquence' );
var chalk = require( 'chalk' );

var clRequest = require( './cl-request' );
var clParser = require( './cl-parser' );

var app = express();

var host = 'localhost';
var port = 3000;
app.listen( port, host, function() {
	console.log( chalk.green( '► Server running on [ ' + host + ':' + port + ' ]' ) );
} );

app.get( '/', function( req, res ) {
	res.end( 'CL API v1.0.0' );
} );

app.get( '/api/:id/:year/:sem', function( req, res ) {

	var arg = req.params;

	ASQ().then( function( done ) {
		clRequest.getCookie( done );
	} ).then( function( done ) {
		clRequest.getCourse( done, arg.id, arg.year, arg.sem );
	} ).val( function( data ) {
		res.json( clParser( data ) );
	} ).or( function( code, msg ) {
		res.json( new ERROR( code, msg ) );
	} );
} );

app.get( '*', function( req, res ) {
	res.json( new ERROR( 400, 'Bad request' ) );
} );

function ERROR( code, msg ) {
	this.error = {
		code: code,
		msg: msg
	};
}
