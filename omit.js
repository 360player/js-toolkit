'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = omit;


/**
 *	Creates a copy of source object and returns a filtered object without omit keys.
 *
 *	@param object sourceObject
 *	@param string, ... omitKeys
 *
 *	@return MixedObject
 */
function omit(sourceObject) {
	var filteredObject = Object.assign({}, sourceObject);

	for (var _len = arguments.length, omitKeys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		omitKeys[_key - 1] = arguments[_key];
	}

	omitKeys.forEach(function (omitKey) {
		var omitKeyExists = Object.keys(sourceObject).indexOf(omitKey) > -1;

		if (omitKeyExists === true) {
			delete filteredObject[omitKey];
		}
	});

	return filteredObject;
}

/* @type-dependencies */