/* @flow */

/**
 *	@type StorageDataMapType
 */
type StorageDataMapType = { [ key : string ] : mixed };

/**
 *	@const WeakMap weakStorage
 */
const weakStorage : WeakMap<WeakStorage, StorageDataMapType> = new WeakMap();

/**
 *	@private
 *	Returns {@see StorageDataMapType}.
 *
 *	@param WeakStorage context
 *
 *	@return StorageDataMapType
 */
function getStore( context : WeakStorage ) : StorageDataMapType {
	let storageDataMap = weakStorage.get( context );

	if ( storageDataMap === null || storageDataMap === undefined ) {
		let emptyStorageDataMap : StorageDataMapType = {};
		storageDataMap = emptyStorageDataMap;
	}

	return storageDataMap;
}

/**
 *	@private
 *	Clear storage.
 *
 *	@param WeakStorage context
 *
 *	@return void
 */
function clearStore( context : WeakStorage ) {
	let emptyStorageDataMap : StorageDataMapType = {};
	weakStorage.set( context, emptyStorageDataMap );
}

/**
 *	@private
 *	Sets item to storage.
 *
 *	@param WeakStorage context
 *	@param string key
 *	@param mixed data
 *
 *	@return void
 */
function setItem( context : WeakStorage, key : string, data : mixed ) {
	let storageDataMap : StorageDataMapType = getStore( context );
	storageDataMap[ key ] = data;
	weakStorage.set( context, storageDataMap );
}

/**
 *	@private
 *	Retrieves item from storage.
 *
 *	@param WeakStorage context
 *	@param string key
 *
 *	@return void
 */
function getItem( context : WeakStorage, key : string ) : mixed {
	let storageDataMap : StorageDataMapType = getStore( context );

	if ( storageDataMap.hasOwnProperty( key ) === true ) {
		return storageDataMap[ key ];
	}

	return null;
}

/**
 *	@private
 *	Removes item from storage.
 *
 *	@param WeakStorage context
 *	@param string key
 *
 *	@return void
 */
function removeItem( context : WeakStorage, key : string ) {
	let storageDataMap : StorageDataMapType = getStore( context );

	if ( storageDataMap.hasOwnProperty( key ) === true ) {
		delete storageDataMap[ key ];
		weakStorage.set( context, storageDataMap );
	}
}

/**
 *	Storage API wrapper for WeakMap
 */
export default class WeakStorage {

	/**
	 *	Creates a new empty weak store.
	 *
	 *	@return void
	 */
	constructor() {
		clearStore( this );
	}

	setItem( key : string, data : mixed ) {
		setItem( this, key, data );
	}

	getItem( key : string ) : mixed {
		return getItem( this, key );
	}

	removeItem( key : string ) {
		removeItem( this, key );
	}

	clear() {
		clearStore( this );
	}

	get length() : number {
		let storageDataMap : StorageDataMapType = getStore( this );
		return Object.keys( storageDataMap ).length;
	}

}
