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
	console.log( chalk.green( `► Server running on [ ${host}:${port} ]` ) );
} );

app.get( '/', ( req, res ) => {
	res.end( 'CL API v1.0.0' );
} );

app.get( '/api/:id/:year/:sem', ( req, res ) => {

	var arg = req.params;

	ASQ()
		.then( ( done ) => {
			clRequest.getCookie( done );
		} )
		.then( ( done ) => {
			clRequest.getCourse( done, arg.id, arg.year, arg.sem );
		} )
		.val( ( data ) => {
			res.json( clParser( data ) );
		} )
		.or( ( code, msg ) => {
			res.json( new ERROR( code, msg ) );
		} )

} );

app.get( '*', function ( req, res ) {
	res.json( new ERROR( 400, 'Bad request') );
} );

function ERROR( code, msg ) {
	this.error = { code: code, msg: msg };
}
