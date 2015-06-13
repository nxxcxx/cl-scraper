'use strict';

var chalk = require( 'chalk' );
var request = require( 'request' );
// require( 'request-debug' )( request );

var cl_cookie_uri = 'http://classlookup.au.edu/clu_ug/index.jsp';
var cl_cookie_jar = request.jar();
var cl_requiest_uri = 'http://classlookup.au.edu/clu_ug/result.jsp';
var cl_form = { courseid: 'bg2001', txtyear: '2014', txtsem: '3' };

var factory = {};

factory.getCookie = ( done ) => {

	request( { uri: cl_cookie_uri, jar: cl_cookie_jar }, ( err, res, body ) => {

		if ( err ) console.log( chalk.red( err ) );
		done();

	} );
}

factory.getCourse = ( done ) => {

	var req_options = {

		method: 'POST',
		url: cl_requiest_uri,
		jar: cl_cookie_jar,
		form: cl_form

	};

	request( req_options, ( err, res, body ) => {

		if ( !err && res.statusCode == 200 ) {

			done( body );

		} else {

			console.log( chalk.red( res.statusCode, err ) );

		}

	} );

}

module.exports = factory;
