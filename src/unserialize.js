/* @flow */

/* @type-dependencies */
import type { MixedObjectType } from './generics';

/**
 *	Lazily type casts string values into possible actual type values.
 *
 *	@param mixed unresolvedValue
 *
 *	@return mixed
 */
export function unserializeValue( unresolvedValue : string ) : mixed {
	if ( unresolvedValue === 'true' ) return true;

	if ( unresolvedValue === 'false' ) return false;

	if ( unresolvedValue === 'null' ) return null;

	if ( unresolvedValue === 'undefined' ) return undefined;

	if ( isNaN( unresolvedValue ) === false ) {
		return parseFloat( unresolvedValue );
	}

	return unresolvedValue;
}

/**
 *	Reverse of {@see serialize.js}, parses a serialized string into object.
 *
 *	@param string unresolvedString
 *
 *	@return string
 */
export default function unserialize( unresolvedString : string ) : MixedObjectType {
	// @FLOWFIXME https://github.com/facebook/flow/issues/2221
	let parameterSegments : Array<string> = `${unresolvedString}`.split( '&' );
	const unserializedObject : MixedObjectType = {};

	parameterSegments.forEach( parameterSegment => {
		const [ key, value ] = parameterSegment.split( '=' );
		const decodedKey : string = decodeURIComponent( key );
		let decodedValue : mixed = unserializeValue( decodeURIComponent( value ) );

		unserializedObject[ decodedKey ] = decodedValue;
	});

	return unserializedObject;
}
