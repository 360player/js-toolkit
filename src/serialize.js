/* @flow */

/* @type-dependencies */
import type { MixedObjectType } from './generics';

/**
 *	Serializes object into string
 *
 *	@param MixedObjectType unresolvedObjet
 *
 *	@return string
 */
export default function serialize( unresolvedObject : MixedObjectType ) : string {
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
