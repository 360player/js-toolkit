'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.unserializeValue = unserializeValue;
exports.default = unserialize;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	Lazily type casts string values into possible actual type values.
 *
 *	@param mixed unresolvedValue
 *
 *	@return mixed
 */
function unserializeValue(unresolvedValue) {
	if (unresolvedValue === 'true') return true;

	if (unresolvedValue === 'false') return false;

	if (isNaN(unresolvedValue) === false) {
		return parseFloat(unresolvedValue);
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


/* @type-dependencies */
function unserialize(unresolvedString) {
	// @FLOWFIXME https://github.com/facebook/flow/issues/2221
	var parameterSegments = ('' + unresolvedString).split('&');
	var unserializedObject = {};

	parameterSegments.forEach(function (parameterSegment) {
		var _parameterSegment$spl = parameterSegment.split('='),
		    _parameterSegment$spl2 = (0, _slicedToArray3.default)(_parameterSegment$spl, 2),
		    key = _parameterSegment$spl2[0],
		    value = _parameterSegment$spl2[1];

		var decodedKey = decodeURIComponent(key);
		var decodedValue = unserializeValue(decodeURIComponent(value));

		unserializedObject[decodedKey] = decodedValue;
	});

	return unserializedObject;
}