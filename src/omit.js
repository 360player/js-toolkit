/* @flow */

/* @type-dependencies */
import type { MixedObjectType } from './generics';

/**
 *	Creates a copy of source object and returns a filtered object without omit keys.
 *
 *	@param object sourceObject
 *	@param string, ... omitKeys
 *
 *	@return MixedObject
 */
export default function omit( sourceObject : MixedObjectType, ...omitKeys : Array<string> ) : MixedObjectType {
	let filteredObject : MixedObjectType = Object.assign( {}, sourceObject );

	omitKeys.forEach( ( omitKey : string ) => {
		const omitKeyExists : boolean = ( Object.keys( sourceObject ).indexOf( omitKey ) > -1 );

		if ( omitKeyExists === true ) {
			delete filteredObject[ omitKey ];
		}
	});

	return filteredObject;
}
