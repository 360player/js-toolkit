/* @flow */

/**
 *	@type AssociationType
 */
type AssociationType = { [ key : string ] : mixed };

/**
 *	Combines two arrays of equal size into a literal object.
 *
 *	@param array keys
 *	@param array values
 *
 *	@return AssociationType
 */
export default function associate( keys : Array<string>, values : Array<mixed> ) : AssociationType {
	const targetObject : AssociationType = {};

	if ( keys.length !== values.length ) {
		throw new RangeError( 'Keys and value arrays must match in size.' );
	}

	return keys.reduce(( target, key, index ) => {
		target[ key ] = values[ index ];
		return target;
	}, targetObject );
}
