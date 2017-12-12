'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = only;


/**
 *	Creates a copy of source object and returns a filtered object with only keep keys.
 *
 *	@param object sourceObject
 *	@param string, ... keepKeys
 *
 *	@return MixedObjectType
 */
function only(sourceObject) {
	var filteredObject = {};
	var keepKey = void 0;

	for (var _len = arguments.length, keepKeys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		keepKeys[_key - 1] = arguments[_key];
	}

	keepKeys.forEach(function (keepKey) {
		var keyExists = Object.keys(sourceObject).indexOf(keepKey) > -1;

		if (keyExists) {
			filteredObject[keepKey] = sourceObject[keepKey];
		}
	});

	return filteredObject;
}

/* @type-dependencies */