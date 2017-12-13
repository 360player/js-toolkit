/* @flow */

/* @type-dependencies */
import type { MixedObjectType } from './generics';

/**
 *	Dissects a single source object into a dissected object, and a remaining object.
 *
 *	@param MixedObjectType sourceObject
 *	@param string, ... omitKeys
 *
 *	@return [ MixedObjectType, MixedObjectType ]
 */
export default function dissect( sourceObject : MixedObjectType, ...dissectKeys : Array<string> ) : [ MixedObjectType, MixedObjectType ] {
	const remainingObject : MixedObjectType = {};
	const dissectedObject : MixedObjectType = {};
	const sourceKeys : Array<string> = Object.keys( sourceObject );

	// @NOTE Compare if source object keys and dissect keys are the same, throw error
	const compareKeys = ( key, n ) => key === dissectKeys[ n ];

	if ( sourceKeys.length === dissectKeys.length && sourceKeys.every( compareKeys ) ) {
		throw new Error( 'dissect: Trying to dissect into same as source object.' );
	}

	for ( const [ key, value ] of Object.entries( sourceObject ) ) {
		if ( dissectKeys.includes( key ) ) {
			dissectedObject[ key ] = value;
		} else {
			remainingObject[ key ] = value;
		}
	}

	return [ dissectedObject, remainingObject ];
}
