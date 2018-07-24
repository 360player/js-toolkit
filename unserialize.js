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
	var unserializedObject = {};
	var urlSearchParams = new URLSearchParams(unresolvedString);

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = urlSearchParams.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
			    key = _step$value[0],
			    value = _step$value[1];

			var decodedKey = decodeURIComponent(key);
			var decodedValue = unserializeValue(decodeURIComponent(value));

			unserializedObject[decodedKey] = decodedValue;
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return unserializedObject;
}