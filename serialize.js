'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = serialize;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	Serializes object into string
 *
 *	@param MixedObjectType unresolvedObjet
 *
 *	@return string
 */
function serialize(unresolvedObject) {
	var parameterSegments = [];

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.entries(unresolvedObject)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
			    key = _step$value[0],
			    value = _step$value[1];

			var encodedKey = encodeURIComponent(key);

			if (value === null) {
				parameterSegments.push(encodedKey);
			} else {
				// @FLOWFIXME https://github.com/facebook/flow/issues/2221
				var encodedValue = encodeURIComponent(value);

				parameterSegments.push(encodedKey + '=' + encodedValue);
			}
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

	return parameterSegments.join('&');
}

/* @type-dependencies */