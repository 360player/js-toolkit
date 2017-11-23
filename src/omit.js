/* @flow */

/**
 *	Creates a copy of source object and returns a filtered object without omit keys.
 *
 *	@param object sourceObject
 *	@param string, ... omitKeys
 *
 *	@return object
 */
export default function omit( sourceObject : Object, ...omitKeys : Array<string> ) : Object {
	let filteredObject : Object = Object.assign( {}, sourceObject );

	omitKeys.forEach( omitKey => {
		const omitKeyExists : boolean = ( Object.keys( sourceObject ).indexOf( omitKey ) > -1 );

		if ( omitKeyExists === true ) {
			delete filteredObject[ omitKey ];
		}
	});

	return filteredObject
}
