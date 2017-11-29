/* @flow */

/* @dependencies */
import omit from './omit';

/* @type-dependencies */
import type { MixedObjectType } from './generics';

/**
 *	Removes redundant slashes from URI path.
 *
 *	@param string unresolvedUrl
 *
 *	@return string
 */
export function cleanUriPath( unresolvedUrl : string ) : string {
	return unresolvedUrl
		.replace( /\/+/g, '/' )
		.replace( /\/+$/, '' );
}

/**
 *	Serializes object into string
 *
 *	@param MixedObjectType unresolvedObjet
 *
 *	@return string
 */
export function serializeParameters( unresolvedObject : MixedObjectType ) : string {
	let parameterSegments : Array<string> = [];

	for( const [ key, value ] of Object.entries( unresolvedObject ) ) {
		if ( key !== null ) {
			const encodedKey : string = encodeURIComponent( key );

			// @FLOWFIXME https://github.com/facebook/flow/issues/2221
			const encodedValue : string = encodeURIComponent( value );

			parameterSegments.push( `${encodedKey}=${encodedValue}` );
		}
	}

	return parameterSegments.join( '&' );
}

/**
 *	Transforms a parameterized URL into a resolved URL path.
 *
 *	@param string parameterizedUrl
 *	@param MixedObjectType replacementMap
 *	@param RegExp lookupPattern
 *
 *	@return string
 */
export function transformUrlParameters( parameterizedUrl : string, replacementMap : MixedObjectType, lookupPattern : RegExp = /\:(\w+)/g ) : string {
	let omitKeys : Array<string> = [];

	function replaceMatch( match : string, key : string ) : string {
		if ( replacementMap.hasOwnProperty( key ) === true ) {
			omitKeys.push( key );
			// @FLOWFIXME https://github.com/facebook/flow/issues/2221
			return replacementMap[ key ];
		}

		return '';
	};

	const transformedUrl : string = cleanUriPath( parameterizedUrl ).replace( lookupPattern, replaceMatch );

	const queryString : string = serializeParameters( omit( replacementMap, ...omitKeys ) );
	const urlSuffix : string = ( queryString.length > 0 ) ? `?${queryString}` : '';

	return transformedUrl + urlSuffix;
}
