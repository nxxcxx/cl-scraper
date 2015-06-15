'use strict';

function _slicedToArray( arr, i ) {
	if ( Array.isArray( arr ) ) {
		return arr;
	} else if ( Symbol.iterator in Object( arr ) ) {
		var _arr = [];
		var _n = true;
		var _d = false;
		var _e = undefined;
		try {
			for ( var _i = arr[ Symbol.iterator ](), _s; !( _n = ( _s = _i.next() ).done ); _n = true ) {
				_arr.push( _s.value );
				if ( i && _arr.length === i ) break;
			}
		} catch ( err ) {
			_d = true;
			_e = err;
		} finally {
			try {
				if ( !_n && _i[ 'return' ] ) _i[ 'return' ]();
			} finally {
				if ( _d ) throw _e;
			}
		}
		return _arr;
	} else {
		throw new TypeError( 'Invalid attempt to destructure non-iterable instance' );
	}
}

var cheerio = require( 'cheerio' );
var util = require( 'util' );

function parse( body ) {

	var rawCL = [];
	var $ = cheerio.load( body );

	var res = $( 'table[width="717"] tbody tr' ).eq( 1 ).children( 'td' ).eq( 1 ).children( 'table' ).eq( 1 ).children( 'tbody' ).children();
	res = res.slice( 2, res.length - 1 );

	if ( res.length === 0 ) return {}; // course not found return empty obj

	// for each <td> in <tr>
	res.each( function( idx1, elem1 ) {

		var partialCourseList = [];
		$( elem1 ).children().slice( 1 ).each( function( idx2, elem2 ) {

			var cnt = $( elem2 ).text();
			partialCourseList.push( cnt );
		} );
		rawCL.push( partialCourseList );
	} );

	cleanTable( rawCL );
	var restructuredTable = restructureTable( rawCL );
	var header = parseHeader( $ );
	restructuredTable.header = header;

	// console.log( util.inspect( restructuredTable, false, null ) );
	// console.log( '-----------------------------------------' );

	return restructuredTable;
}

function parseHeader( $ ) {

	var res = $( 'body script' ).text();

	// get anyting in double quotes
	var matches = res.match( /"([^"]*)"/g ).map( function( v ) {
		return v.replace( /"/g, '' );
	} );

	res = {};
	// ES6 Array destructuring assignment without declaration

	var _matches = _slicedToArray( matches, 7 );

	res.id = _matches[ 0 ];
	res.name = _matches[ 1 ];
	res.credit = _matches[ 2 ];
	res.p0 = _matches[ 3 ];
	res.p1 = _matches[ 4 ];
	res.p2 = _matches[ 5 ];
	res.p3 = _matches[ 6 ];

	return res;
}

function cleanTable( list ) {

	list.forEach( function( value ) {

		//Time remove white scpace
		value[ 3 ] = value[ 3 ].replace( /\s/g, '' );
		//Instructor
		value[ 9 ] = value[ 9 ].replace( /- -/g, '-' );
		//Remark
		value[ 10 ] = value[ 10 ].replace( /\*/g, '' ).trim();
	} );
}

function restructureTable( list ) {

	var res = {};

	list.forEach( function( value ) {

		var sec = value[ 0 ];

		if ( !res[ sec ] ) {
			res[ sec ] = {
				schedule: {}
			};
		}

		var scheduleIdx = Object.keys( res[ sec ][ 'schedule' ] ).length;
		res[ sec ][ 'schedule' ][ scheduleIdx ] = {

			day: value[ 2 ],
			time: value[ 3 ],
			room: value[ 4 ],
			inst: value[ 9 ]

		};

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
				rmk: value[ 10 ]

			};
		}
	} );

	return res;
}

module.exports = parse;
