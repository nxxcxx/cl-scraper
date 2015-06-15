'use strict';

var request = require( 'request' );
// require( 'request-debug' )( request );

var cl_cookie_uri = 'http://classlookup.au.edu/clu_ug/index.jsp';
var cl_cookie_jar = request.jar();
var cl_requiest_uri = 'http://classlookup.au.edu/clu_ug/result.jsp';

var cl = {};

cl.getCookie = function( done ) {

	request( {

		uri: cl_cookie_uri,
		jar: cl_cookie_jar

	}, function( err, res, body ) {

		handleRes( err, res, body, done );
	} );
};

cl.getCourse = function( done, id, year, sem ) {

	var req_options = {

		method: 'POST',
		uri: cl_requiest_uri,
		jar: cl_cookie_jar,
		form: {
			courseid: id,
			txtyear: year,
			txtsem: sem
		}

	};

	request( req_options, function( err, res, body ) {

		handleRes( err, res, body, done );
	} );
};

function handleRes( err, res, body, done ) {

	if ( !res ) done.fail( 500, 'WTF' );
	else if ( !err && res.statusCode === 200 ) done( body );
	else if ( res.statusCode === 302 ) done.fail( res.statusCode, 'check cookie' );
	else done.fail( res.statusCode, err );
}

module.exports = cl;
