/* @flow */

/* @type-dependencies */
import type { MixedObjectType } from './generics';

/**
 *	Creates a copy of source object and returns a filtered object with only keep keys.
 *
 *	@param object sourceObject
 *	@param string, ... keepKeys
 *
 *	@return MixedObjectType
 */
export default function only( sourceObject : MixedObjectType, ...keepKeys : Array<string> ) : MixedObjectType {
	let filteredObject : MixedObjectType = {};
	let keepKey : string;

	keepKeys.forEach( keepKey => {
		const keyExists : boolean = ( Object.keys( sourceObject ).indexOf( keepKey ) > -1 );

		if ( keyExists ) {
			filteredObject[ keepKey ] = sourceObject[ keepKey ];
		}
	});

	return filteredObject;
}
