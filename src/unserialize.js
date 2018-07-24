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
	const unserializedObject : MixedObjectType = {};
	const urlSearchParams : URLSearchParams = new URLSearchParams( unresolvedString );

	for ( let [ key, value ] of urlSearchParams.entries() ) {
		const decodedKey : string = decodeURIComponent( key );
		const decodedValue : mixed = unserializeValue( decodeURIComponent( value ) );

		unserializedObject[ decodedKey ] = decodedValue;
	}

	return unserializedObject;
}
