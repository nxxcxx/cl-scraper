'use strict';

var cheerio = require( 'cheerio' );
var util = require( 'util' );
var chalk = require( 'chalk' );

function parse( body ) {

	var rawCL = [];
	var $ = cheerio.load( body );

	var res = $( 'table[width="717"] tbody tr' ).eq( 1 ).children( 'td' ).eq( 1 ).children( 'table' ).eq( 1 ).children( 'tbody' ).children();
	var len = res.length;
	res = res.slice( 2, len - 1 );

	if ( res.length === 0 ) {
		return {};
	} // course not found exit return not found

	res.each( function( idx1, elem1 ) {

		var partialCourseList = [];
		$( elem1 ).children().slice( 1 ).each( function( idx2, elem2 ) {

			var cnt = $( elem2 ).text();
			// process.stdout.write( `${cnt} ` );
			partialCourseList.push( cnt );
		} );
		// console.log();
		rawCL.push( partialCourseList );
	} );

	clean( rawCL );
	var restructuredCL = restructure( rawCL );
	// console.log( util.inspect( restructuredCL, false, null ) );
	// console.log( '-----------------------------------------' );

	return restructuredCL;
}

function clean( list ) {

	list.forEach( function( value ) {

		//Time: remove white scpace
		value[ 3 ] = value[ 3 ].replace( /\s/g, '' );
		//Instructor
		value[ 9 ] = value[ 9 ].replace( /- -/g, 'N/A' );
		//Campus
		value[ 10 ] = value[ 10 ].replace( /\*/g, '' ).trim();
	} );
}

function restructure( list ) {

	var res = {};
	var scheduleIdx = 0;

	list.forEach( function( value ) {

		var sec = value[ 0 ];

		if ( !res[ sec ] ) {
			res[ sec ] = {};
			res[ sec ][ 'schedule' ] = {};
			scheduleIdx = 0;
		}

		res[ sec ][ 'schedule' ][ scheduleIdx ] = {

			day: value[ 2 ],
			time: value[ 3 ],
			room: value[ 4 ],
			instructor: value[ 9 ]

		};
		scheduleIdx++;

		if ( !res[ sec ][ 'info' ] ) {
			res[ sec ][ 'info' ] = {

				ava: value[ 1 ],
				mid: {
					Date: value[ 5 ],
					Time: value[ 6 ]
				},
				fin: {
					Date: value[ 7 ],
					Time: value[ 8 ]
				},
				remark: value[ 10 ]

			};
		}
	} );

	return res;
}

module.exports = parse;
