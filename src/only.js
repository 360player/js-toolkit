/* @flow */

/**
 *	Creates a copy of source object and returns a filtered object with only keep keys.
 *
 *	@param object sourceObject
 *	@param string, ... keepKeys
 *
 *	@return object
 */
export default function only( sourceObject : Object, ...keepKeys : Array<string> ) : Object {
	let filteredObject : Object = {};

	keepKeys.forEach( keepKey => {
		const keyExists : boolean = ( Object.keys( sourceObject ).indexOf( keepKey ) > -1 );

		if ( keyExists ) {
			filteredObject[ keepKey ] = sourceObject[ keepKey ];
		}
	});

	return filteredObject
}
