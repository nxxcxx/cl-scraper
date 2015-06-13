'use strict';

var express = require( 'express' );
var ASQ = require( 'asynquence' );
var chalk = require( 'chalk' );

var clRequest = require( './cl-request' );
var clParser = require( './cl-parser' );

var app = express();

var host = 'localhost';
var port = 3000;
app.listen( port, host, () => {
	console.log( chalk.blue( `► Server running on [ ${host}:${port} ]` ) );
} );

app.get( '/', ( req, res ) => {
	res.end( 'API v1.0.0' );
} );

app.get( '/api',  ( req, res ) => {

	ASQ( ( done ) => {
		clRequest.getCookie( done );
	} )
	.then( ( done ) => {
		clRequest.getCourse( done );
	} )
	.val( ( data ) => {
		res.json( clParser( data ) );
	} );

} );
