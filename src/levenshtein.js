/* @flow */

export default function levenshtein( a : string, b : string ) : mixed {
	if ( a.length === 0 ) return b.length;
	if ( b.length === 0 ) return a.length;

	if ( a.length > b.length ) {
		let c = a;
		a = b;
		b = c;
	}

	let n : number = 0;
	let prev : mixed;
	let value : mixed;
	let al : number = a.length;
	let bl : number = b.length;
	let row : Array<mixed> = Array( al + 1 );

	for ( n = 0; n <= al; n++ ) {
		row[ n ] = n;
	}

	for( n = 1; n <= al; n++ ) {
		prev = n;

		for( let j = 1; j <= al; j++ ) {
			if ( b[ n - 1 ] === a[ j - 1 ] ) {
				value = row[ j - 1 ];
			} else {
				// @FLOWFIXME Flow might get confused whether or not this is a string, or a number since we're juggling it's value.
				value = Math.min( row[ j - 1 ] + 1, Math.min( prev + 1, row[ j ] + 1 ) );
			}

			row[ j - 1 ] = prev;
			prev = value;
		}

		row[ al ] = prev;
	}

	return row[ al ];
}
